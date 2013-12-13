//declare required modules
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , static = require('node-static')
  , sys = require('sys')
  , PwmDriver = require('adafruit-i2c-pwm-driver')
  , sleep = require('sleep')
  , argv = require('optimist').argv;
  app.listen(8080);


//set the address and device name of the breakout board
pwm = new PwmDriver(0x40,'/dev/i2c-0');

//set pulse widths
setServoPulse = function(channel, pulse) {
  var pulseLength;
  pulseLength = 1000000;
  pulseLength /= 60;
  print("%d us per period" % pulseLength);
  pulseLength /= 4096;
  print("%d us per bit" % pulseLength);
  pulse *= 1000;
  pulse /= pulseLength;
  return pwm.setPWM(channel, 0, pulse);
};

//set pulse frequency
pwm.setPWMFreq(60);

//Make a web server on port 8080

var file = new(static.Server)();
function handler(request, response) {
  console.log('serving file',request.url)
  file.serve(request, response);
};

console.log('Pi Car we server listening on port 8080 visit http://ipaddress:8080/socket.html');

lastAction = "";

function emergencyStop(){
  pwm.setPWM(0, 0, 400); //center front wheels
  pwm.setPWM(1, 0, 330); //stop motor
  console.log('###EMERGENCY STOP - signal lost or shutting down');
}


if (argv.beta) {
  console.log("\nPerforming one off servo position move to: "+argv.beta);
  pwm.setPWM(0, 0, argv.beta); //using direct i2c pwm modue
  pwm.stop();
  return process.exit();
}
if (argv.gamma) {
  console.log("\nPerforming one off servo position move to: "+argv.gamma);
  pwm.setPWM(1, 0, argv.gamma); //using direct i2c pwm modue
  pwm.stop();
  return process.exit();
}


//fire up a web socket server 
io.sockets.on('connection', function (socket) { 
  socket.on('fromclient', function (data) {
  console.log("Beta: "+data.beta+" Gamma: "+data.gamma);
  //exec("echo 'sa "+data+"' > /dev/ttyAMA0", puts); //using http://electronics.chroma.se/rpisb.php
  //exec("picar.py 0 "+data.beta, puts); //using python adafruit module
  pwm.setPWM(0, 0, data.beta); //using direct i2c pwm modue
  pwm.setPWM(1, 0, data.gamma); //using direct i2c pwm modue
  clearInterval(lastAction); //stop emergency stop timer
  lastAction = setInterval(emergencyStop,1000); //set emergency stop timer for 1 second
  });
});

process.on('SIGINT', function() {
  emergencyStop();
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  pwm.stop();
  return process.exit();
});
