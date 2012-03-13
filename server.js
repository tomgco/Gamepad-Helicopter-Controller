var SerialPort = require("serialport").SerialPort
  , serialPort = new SerialPort("/dev/cu.usbmodemfd121", {
      baudrate: 300
    })
  , app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  ;

var currentCommand = '';

var nom = {};

// setInterval(function(){console.log(nom);}, 1000);

io.sockets.on('connection', function (socket) {
  socket.emit('connection', { success: true });
  socket.on('control', function (data) {
    // serialPort.write(String.fromCharCode(
    //     0x4C
    //   , 0x4F
    //   , 0x31
    //   , data.yaw
    //   , data.pitch
    //   , data.throttle
    //   , data.trim
    // ));
  nom = data;
    var stringData = String.fromCharCode(
        0x4C
      , 0x4F
      , 0x31
      , data.yaw + 1
      , data.pitch + 1
      , data.throttle + 1
      , data.trim + 1
    );
    process.nextTick(function() {
      serialPort.write(stringData);
    });
  });
});

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}