//declare required modules
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , static = require('node-static')
  , sys = require('sys')
  , piblaster = require('pi-blaster.js')
  , sleep = require('sleep')
  , argv = require('optimist').argv;
  app.listen(8080);


//Make a web server on port 8080
//
var file = new(static.Server)();
function handler(request, response) 
{
  console.log('serving file',request.url)
  file.serve(request, response);
};

var smoothed_throttle = .14;
var logcount = 0;
var old_gamma = .14;
var old_beta = .14;

console.log('Pi Car we server listening on port 8080 visit http://ipaddress:8080/socket.html');

lastAction = "";

//If we lose comms set the servos to neutral
//
function emergencyStop()
{
	//enter 0 point here specific to your pwm control
  	piblaster.setPwm(17, .14); //thr
 	piblaster.setPwm(18, .14); //spd
  	console.log('###EMERGENCY STOP - signal lost or shutting down');
}//END emergencyStop


// fire up a web socket server isten to cmds from the phone and set pwm
// accordingly, if using a separate battery pack then disable the 
// motor acceleration rate limiting algorithm as this is required when the
// Pi and motors share the same battery.
//
io.sockets.on('connection', function (socket) 
{ 
	//got phone msg
	socket.on('fromclient', function (data) 
	{
		logcount = logcount + 1;

		// rate limit accelration only
		// we want normal de-cceleration as this doesn't drain the battery
		if((data.gamma > .14) && (data.gamma > smoothed_throttle)) //fwd accel
		{
			//if we went full back to full fwd... skip some rate limiting
			if(smoothed_throttle < .14)
			{
				smoothed_throttle = .14;
			}
			// .035 = fwd range; .0035 = .5s .: .01 is roughy 1.5s to full accel @ 20Hz
			smoothed_throttle += .001;
		}
		else if ((data.gamma < .14) && (data.gamma < smoothed_throttle)) //rev accel
		{ 
			// if we go full fwd to full back... 
			if(smoothed_throttle > .14)
			{
				smoothed_throttle = .14; 
			}
			// rate limit throttle to prevent power resets
			smoothed_throttle -= .0003;   // reverse is non linear due to brakeing option so make it even slower
		}
		else 
			smoothed_throttle = data.gamma; //slow down normally
			
		//smoothed_throttle = data.gamma; //uncomment this line if using dedicated Pi battery pack
			
		// dont let char echos slow dn the app; we are running at 20Hz
		// dont le the console limit this due to slow echoing of chars
		if(logcount == 10)
		{
			//@ 2 Hz
			logcount = 0;
			console.log("Beta: "+data.beta+" Gamma: "+data.gamma+" smoothed: "+smoothed_throttle);				
		}
		
		//control car using clever pwm gpio library
		piblaster.setPwm(17, smoothed_throttle); //throttle using soft pwm
		piblaster.setPwm(18, data.beta); //throttle using soft pwm

		clearInterval(lastAction); //stop emergency stop timer
		lastAction = setInterval(emergencyStop,2000); //set emergency stop timer for 1 second
				
	});
});//END io.sockets.on


//user hits ctrl+c
//
process.on('SIGINT', function() 
{
  emergencyStop();
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
 
  return process.exit();
});//END process.on 
