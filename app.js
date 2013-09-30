var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , sys = require('sys')

app.listen(8080);
  var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

function handler (req, res) {
  fs.readFile(__dirname + '/socket.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading socket.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

lastAction = "";

function emergencyStop(){
  exec("echo 'sa 0 -500' > /dev/ttyAMA0", puts);
}

io.sockets.on('connection', function (socket) {
  socket.on('fromclient', function (data) {
  //console.log(data);
  exec("echo 'sa "+data+"' > /dev/ttyAMA0", puts);
  clearInterval(lastAction);
  lastAction = setInterval(emergencyStop,1000);
  });
});
