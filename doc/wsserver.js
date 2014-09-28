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


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            messageMP = message.utf8Data
            //console.log(messageMP)
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
            io.sockets.emit('message', message);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
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
  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    modserver.send(messageBF, 0, messageBF.length, 8424, "localhost", function(err, bytes) {
      console.log(err)
    });
});

modserver.on("listening", function () {
  var address = modserver.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});
