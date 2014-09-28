/* 
 * Ground Control - Gamepad 
 * Copyright (c) 2014 Group - Qi
 * 
 * Please read the Copyright file for further details.
 * 
 * gamepad.js sends the values from the gamepad to the server, aswell as 
 * display them on the website
 * 
 */

/* rAF stand for request animation frame, 
 * necessary for animations in the browser
 */
var rAF = window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame;

var gamepad = null;
var connection = null;

var armed = false;
var armingCounter = 0;
var disarmingCounter = 0;

var lat = 0;
var long = 0;
var latLongCount = 0;

var ip = "";

updateIP();

function connect(e) {
    gamepad = e.gamepad;
    console.log(gamepad.id);
    checkOS();
    check(gamepad);
    
    displayInfo("trying to connect..");
    
    console.log(ip);
    connection = new WebSocket('ws://' + ip + ':28450', 'echo-protocol');

    connection.onopen = function() {
        addDisplay();
        addInfo();
        displayInfo("please hold A to arm the quadcopter");
        rAF(inputLoop);
    };

    connection.onerror = function(error) {
        addInfo();
        setTimeout(function(){displayDanger("service not available..");},1000);
        console.log("WebSocket Error " + error);
        readyToArm = false;
    };

    connection.onclose = function() {
        addInfo();
        setTimeout(function(){displayDanger("can not connect");},2000);  
        console.log("Connection closed");
        readyToArm = false;
    };

    connection.onmessage = function(m) {
        var message = m.data;
        updateVisuals(message);
        updateLocation(message);
        if (latLongCount === 0){
            latLongCount++;
            initialize();
        }
        
        
        console.log(message);
        console.log(lat + "|" + long)
    };
}

function disconnect() {
    gamepad = null;
    connection.close();
    setTimeout(function(){displayWarning("please connect your gamepad");},3000);
    removeDisplay();
    
}

// this loop checks for input from the user 
function inputLoop() {

    // button status
    if (buttonPressed(gamepad.buttons[button.A.id])) {
        displayButton("A");
        armingCounter++;
        updateProgressBar(100, "info");
        
        if (armed) {
            updateProgressBar(0, "info");
            armingCounter = 0;
        }
    } else {
        hideButton("A");
        button.A.value = 0;
        armingCounter = 0;
        updateProgressBar(0);
    }

    if (buttonPressed(gamepad.buttons[button.B.id])) {
        displayButton("B");
        disarmingCounter++;
        updateProgressBar(100, "danger");
        
        if (!armed) {
            updateProgressBar(0, "danger");
        }
    } else {
        hideButton("B");
        button.B.value = 0;
        disarmingCounter = 0;
    }

    if (buttonPressed(gamepad.buttons[button.X.id])) {
        button.X.value = 1;
    } else {
        button.X.value = 0;
    }

    if (buttonPressed(gamepad.buttons[button.Y.id])) {
        button.Y.value = 1;
    } else {
        button.Y.value = 0;
    }
    
    // arming and disarming
    if (armingCounter === 100 && armed === false) {
        armed = true;
        //setTimeout(function(){removeInfo();},3000);
        // send the value to arm
        button.A.value = 1;  
        console.log("arming");       
        displayInfo("waiting for an answer from the quad");
    }
    
    if (disarmingCounter === 100 && armed === true) {
        armed = false;
        
        addInfo();
        displayDanger("the quad is now disarmed");
        setTimeout(function(){displayInfo("please hold A to arm the quad");},3000);
        
        // send the value to disarm
        button.B.value = 1;
        console.log("disarming");   
    }
    
    // axis status: send the values to the quadcopter
    connection.send(getValue(axis.horizontalLEFT) + ":" + getValue(axis.verticalRIGHT)
            + ":" + getValue(axis.verticalLEFT) + ":" + getValue(axis.horizontalRIGHT)
            + ":" + button.A.value + ":" + button.B.value + ":" + button.Y.value 
            + ":" + button.X.value + ":0:0:0:0");
    
    rAF(inputLoop);
}

// converts a value to an integer
function toInt(value) {
    return value | 0;
}

// returns a normalized value between 1000 and 2000 for a given axis
function getValue(axisNum) {
    var value = gamepad.axes[axisNum];
    
    // invert the axis verticalLEFT
    if(axisNum === 1){
        value * -1;
    }
    
    value = toInt((value) * 500 + 1500);

    // gets rid of the noise
    if (value < 1550 && value > 1450) {
        value = 1500;
    }
    return value;
}

// checks if a button is pressed
function buttonPressed(b) {

    if (typeof (b) === "object") {
        return b.pressed;
    }
    return b === 1.0;
}

function updateIP() {
    $.getJSON("ipaddress/ipaddress.json", function(data) {
        if (data.ip === "") {
            console.log("no ip adress available");
        } else {
            ip = data.ip;
        }
    });
    setTimeout(updateIP, 3000);
}

function updateLocation(message) {
    var commands = message.split(":");
    
    lat = commands[8];
    long = commands[9];   
}

window.addEventListener("gamepadconnected", connect);
window.addEventListener("gamepaddisconnected", disconnect);
