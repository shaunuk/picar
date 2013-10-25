//declare required modules
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , static = require('node-static')
  , sys = require('sys')
  app.listen(8080);


var file = new(static.Server)();

function handler(request, response) {
  console.log('serving file',request.url)
  file.serve(request, response);
};


console.log('Pi Car we server listening on port 8080');


var exec = require('child_process').exec;




function puts(error, stdout, stderr) { sys.puts(stdout) }

/*
//create a basic web server - port number specified above
function handler (req, res) {
  fs.readFile(__dirname + '/socket.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading socket.html');
    }
    res.writeHead(200);
    console.log('served up page');
    res.end(data);
  });
}

*/

lastAction = "";

function emergencyStop(){
  exec("echo 'sa 0 -500' > /dev/ttyAMA0", puts);
}

io.sockets.on('connection', function (socket) {
  socket.on('fromclient', function (data) {
  console.log(data);
  exec("echo 'sa "+data+"' > /dev/ttyAMA0", puts);
  clearInterval(lastAction);
  lastAction = setInterval(emergencyStop,1000);
  });
});
