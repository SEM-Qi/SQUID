// this is a nodebased alternative to our apache server and was used for testing purposes
 
// set up ======================================================================
var express = require("express");
var app = express();
var port = 8686;
// var WebSocketServer = require('ws').Server;

// configuration ===============================================================
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));          // log every request to the console
    app.use(express.bodyParser());         // pull information from html in POST
});

// routes ======================================================================
app.get("/", function(req, res) {
    res.sendfile('/index.html');
});

// websockets ==================================================================
// var wss = new WebSocketServer({port: 24499});
// var messageMP = "Ping";

// wss.on('connection', function(ws) {
//     ws.on('message', function(message) {
//         console.log("received: %s", message);
//         ws.send(message);
//         messageMP = message
//     });

// });

// listen ======================================================================
app.listen(port);
console.log("Drone control listening on port " + port);

// // Communicate with MAVProxy ===================================================

// var dgram = require("dgram");

// var modserver = dgram.createSocket("udp4");
// modserver.bind(8425)

// modserver.on("error", function (err) {
//  console.log("server error:\n" + err.stack);
//  modserver.close();
// });

// modserver.on("message", function (msg, rinfo) {
//  var messageBF = new Buffer(messageMP);
//  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
//    modserver.send(messageBF, 0, messageBF.length, 8424, "localhost", function(err, bytes) {
//      console.log(err)
//    });
// });

// modserver.on("listening", function () {
//  var address = modserver.address();
//  console.log("server listening " +
//      address.address + ":" + address.port);
// });





















//// set up ======================================================================
//var express             = require("express");
//var app                 = express();
//var WebSocketServer     = require('websocket').server;
//var http                = require('http');
//var port                = 24499;
//var io                  = require('socket.io').listen(port);
//
//
//// listen ======================================================================
//var server = http.createServer(function(request, response) {
//    console.log((new Date()) + ' Received request for ' + request.url);
//    response.writeHead(404);
//    response.end();
//});
//
//server.listen(port);
//console.log("Drone control listening on " + port);
//
//wsServer = new WebSocketServer({
//    httpServer: server,
//    autoAcceptConnections: false
//});
//
//// configuration ===============================================================
//function originIsAllowed(origin) {
//
//    // put logic here to detect whether the specified origin is allowed.
//    return true;
//}
//
//io.sockets.on('connection', function(socket) {
//    io.sockets.emit('this', {will: 'be received by everyone'});
//    console.log('connection');
//
//    socket.on('disconnect', function() {
//        io.sockets.emit('user disconnected');
//    });
//});
//
//wsServer.on('request', function(request) {
//    
//    // Make sure we only accept requests from an allowed origin
//    if (!originIsAllowed(request.origin)) {
//        request.reject();
//        console.log((new Date()) + ' Connection from origin ' + request.origin 
//                + ' rejected.');
//        return;
//    }
//
//    var connection = request.accept('echo-protocol', request.origin);
//
//    connection.on('message', function(message) {
//        
//        if (message.type === 'utf8') {
//            console.log('Received Message: ' + message.utf8Data);
//            connection.sendUTF(message.utf8Data);
//            io.sockets.send(message.utf8Data);
//        }else if (message.type === 'binary') {
//            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//            connection.sendBytes(message.binaryData);
//            io.sockets.emit('message', message);
//        }
//    });
//    
//    connection.on('close', function(reasonCode, description) {
//        console.log((new Date()) + ' Peer ' + connection.remoteAddress 
//                + ' disconnected.');
//    });
//});
