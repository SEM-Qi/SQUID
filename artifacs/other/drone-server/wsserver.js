#!/usr/bin/env node

// source for some of the websocket code: https://github.com/Worlize/WebSocket-Node 
// as a Node package


//Requirements for the server
var WebSocketServer = require('websocket').server;
var http = require('http');

//Feed a 404 for now on http
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

//The server listens on port 28450 for traffic from the Web client (specifically gamepad.js)
server.listen(28450, function() {
    console.log((new Date()) + ' Server is listening on port 28450');
});

//Create websocket server
wsServer = new WebSocketServer({
    httpServer: server,
    // Currently untilised
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // We have not yet constructed any security settings for the 
  // socket connection. The idea is that we can access our pi 
  // from anywhere but were we to expand the code, or restrict control 
  // to one ip while leaving video viewing open we could develop a check here.
  return true;
}

//exec function can be used to push a string as a terminal command
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

//Variables 
var messageMP = "Ping";
var armed = 0;
var startTime = (new Date()).getTime()
var endTime = (new Date()).getTime()
var sound = 1;
var echoMessage = "57.706815:11.936870:4:4"

//receive connection request
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    //Load MAVProxy in a linux screen session
    exec("screen -s /bin/bash -d -m mavproxy.py", puts);
    startTime = (new Date()).getTime()
    connection.on('message', function(message) {
        endTime = (new Date()).getTime()
        //Check countdown to make sure that MAVProxy has loade.
        if ((endTime - startTime) > 25000){
          if (message.type === 'utf8') {
              //Split the message for manipultion and replacement of values
              splitMessage = message.utf8Data.split(':');
              newMessage = splitMessage[0] + ":" + splitMessage[1] + ":" + splitMessage[2] + 
              ":" + splitMessage[3] + ":" + splitMessage[4] + ":" + splitMessage[5] + ":" +
              splitMessage[6] + ":" + splitMessage[7] + ":" + echoMessage;
              //Return the message to the Webclient with updated GPS, Altitude and Groundspeed
              connection.sendUTF(newMessage);

              //assign original websocket message to the messageMP variable to be used by the UDP socket
              messageMP = message.utf8Data;

// Unimplemented sound function.
//      	      if (splitMessage[6] === '1'){
//      		      if (sound === 1){
//      		        sound = 0;
//      		        exec("python /home/pi/project_vt14/SQUID/Webapp/DRONE_SERVER/public/scripts/playmusic/PlayMusic.py TheATeam.mp3", puts);
//                  setTimeout(function(){
//      		        sound = 1;
//                  }, 10000
//                  );
//      		      }		  
//      	      }
              
              //Check if the 'A' button has been pressed to arm the quadcopter
              if (splitMessage[4] === '1'){
                if(armed === 0){
                  //set throttle channel value to safe arming value
		              var rc = "screen -s mavproxy.py -X stuff 'rc 3 1100'`echo '\015'`";
                  exec(rc, puts);
                  //Arm the quadcopter
		              var armit = "screen -s mavproxy.py -X stuff 'arm throttle'`echo '\015'`";
                  exec(armit, puts);
                  armed = 1;
                  //After a timeout for the arming sequence, load testmod2 which handles controls.
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
              //Check if the 'B' button has been pressed to disarm and, if so, 
              //unload module which also disarms the quadcopter
              if (splitMessage[5] === '1'){
                if(armed === 2){
                  exec("screen -s mavproxy.py -X stuff 'module unload testmod2'`echo '\015'`", puts);
                  armed = 0;
                }
              }
//              console.log(messageMP)
          }
        }
    });
    //On connection close, unload the module and close mavproxy. 
    //When we have a safe landing function this will be placed here.
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        exec("screen -s mavproxy.py -X stuff 'module unload testmod2'`echo '\015'`", puts);
        setTimeout(function(){
        exec("screen -s mavproxy.py -X quit", puts);
	armed = 0;
        }, 1000
        ); 
    });
});

//Create incoming UDP socket connection with testmod2.py
var dgram = require("dgram");
var modserver = dgram.createSocket("udp4");
modserver.bind(8425)

//Handle errors
modserver.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  modserver.close();
});

//on the signal message from testmod2,return a string containing the current values of the controller
modserver.on("message", function (msg, rinfo) {
  var messageBF = new Buffer(messageMP);
  //Assign incoming values from testmod2 to the echomessage 
  //send to the webclient for display (GPS ATL AND GS)
  echoMessage = msg
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
