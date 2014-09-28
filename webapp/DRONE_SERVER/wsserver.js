#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(28450, function() {
    console.log((new Date()) + ' Server is listening on port 28450');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
var messageMP = "Ping";
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
var armed = 0;
var startTime = (new Date()).getTime()
var endTime = (new Date()).getTime()
var sound = 1;
var echoMessage = "57.706815:11.936870:4:4"

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    exec("screen -s /bin/bash -d -m mavproxy.py", puts);
    startTime = (new Date()).getTime()
    connection.on('message', function(message) {
        endTime = (new Date()).getTime()
        if ((endTime - startTime) > 25000){
          if (message.type === 'utf8') {
              splitMessage = message.utf8Data.split(':');
              newMessage = splitMessage[0] + ":" + splitMessage[1] + ":" + splitMessage[2] + 
              ":" + splitMessage[3] + ":" + splitMessage[4] + ":" + splitMessage[5] + ":" +
              splitMessage[6] + ":" + splitMessage[7] + ":" + echoMessage;
              console.log(newMessage)
              connection.sendUTF(newMessage);
              messageMP = message.utf8Data
              var commands = messageMP.split(':');
      	      if (splitMessage[6] === '1'){
      		      if (sound === 1){
      		        sound = 0;
      		        exec("python /home/pi/project_vt14/SQUID/Webapp/DRONE_SERVER/public/scripts/playmusic/PlayMusic.py TheATeam.mp3", puts);
                  setTimeout(function(){
      		        sound = 1;
                  }, 10000
                  );
      		      }		  
      	      }
              if (splitMessage[4] === '1'){
                if(armed === 0){
		              var rc = "screen -s mavproxy.py -X stuff 'rc 3 1100'`echo '\015'`";
                  exec(rc, puts);
		              var armit = "screen -s mavproxy.py -X stuff 'arm throttle'`echo '\015'`";
                  exec(armit, puts);
                  armed = 1;
                  setTimeout(function(){
                    exec("screen -s mavproxy.py -X stuff 'module load testmod2'`echo '\015'`", puts);
                  }, 9000
                  );                
                  setTimeout(function(){
                    armed = 2;
                  }, 9000
                  );
                }
              }
              if (splitMessage[5] === '1'){
                if(armed === 2){
                  exec("screen -s mavproxy.py -X stuff 'module unload testmod2'`echo '\015'`", puts);
                  armed = 0;
                }
              }
//              console.log(messageMP)
          }
          else if (message.type === 'binary') {
              console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
              connection.sendBytes(message.binaryData);
              io.sockets.emit('message', message);
          }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        exec("screen -s mavproxy.py -X stuff 'module unload testmod2'`echo '\015'`", puts);
        setTimeout(function(){
        exec("screen -s mavproxy.py -X  quit", puts);
	armed = 0;
        }, 1000
        ); 
    });
});

var dgram = require("dgram");

var modserver = dgram.createSocket("udp4");
modserver.bind(8425)

modserver.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  modserver.close();
});

modserver.on("message", function (msg, rinfo) {
  var messageBF = new Buffer(messageMP);
  echoMessage = msg
  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  modserver.send(messageBF, 0, messageBF.length, 8424, "localhost", function(err, bytes) {
  if (err != null){
  console.log(err);
  }
  });
});

modserver.on("listening", function () {
  var address = modserver.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});
