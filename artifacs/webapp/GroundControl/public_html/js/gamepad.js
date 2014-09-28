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

//  THIS VERSION IS ONLY TESTED WITH AN XBOX CONTROLLER
//  SERVERSIDE IS WORK IN PROGRESS

/* rAF stand for request animation frame, 
 * necessary for animations in the browser
 */
var rAF = window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame;

var gamepad = null;
var gamepadID = "Microsoft X-Box 360";

// default values for buttons and axis
var valButtonA = "N";
var valButtonB = "N";
var valButtonX = "N";
var valButtonY = "N";
var valVerticalLEFT = 50;
var valHorizontalLEFT = 50;
var valVerticalRIGHT = 50;
var valHorizontalRIGHT = 50;

// axis differ depending on OS: these values work on Windows and Linux
var buttonA = 0;
var buttonB = 1;
var buttonX = 2;
var buttonY = 3;
var verticalLEFT = 1;
var horizontalLEFT = 0;
var verticalRIGHT = 4;
var horizontalRIGHT = 3;

var connection = null;

function connect(e) {
    gamepad = e.gamepad;
    console.log(gamepad.id);
    checkOS();
    checkGamepad();
    
    connection = new WebSocket('ws://localhost:28450', 'echo-protocol');
    
    connection.onopen = function() {
        connection.send("Ping");
        addDisplay();
        rAF(inputLoop);
    };

    connection.onerror = function(error) {
        console.log("WebSocket Error " + error);
        //TO-DO: warning for the user
    };

    connection.onclose = function() {
        console.log("Connection closed");
    };
    
    connection.onmessage = function(m) {
        var message = m.data;
        updateVisuals(message);
        console.log(message);
    };  
}

function disconnect(){
    connection.close();
    gamepad = null;
    removeDisplay();
}

// this loop checks for input from the user 
function inputLoop() {
    
    // button status
    if (buttonPressed(gamepad.buttons[buttonA])) {
        valButtonA = "A";
    } else {
        valButtonA = "N";
    }

    if (buttonPressed(gamepad.buttons[buttonB])) {
        valButtonB = "B";
    } else {
        valButtonB = "N";
    }

    if (buttonPressed(gamepad.buttons[buttonX])) {
        valButtonX = "X";
    } else {
        valButtonX = "N";
    }

    if (buttonPressed(gamepad.buttons[buttonY])) {
        valButtonY = "Y";
    } else {
        valButtonY = "N";
    }

    // axis status
    valVerticalLEFT = axisValue(verticalLEFT) + 50;
    valHorizontalLEFT = axisValue(horizontalLEFT) + 50;
    valVerticalRIGHT = axisValue(verticalRIGHT) + 50;
    valHorizontalRIGHT = axisValue(horizontalRIGHT) + 50;
    
    connection.send("_BTN_" + valButtonA + valButtonB + valButtonX + valButtonY
            + "_AXIS_LEFT_" + normalize(valVerticalLEFT) + ":" + normalize(valHorizontalLEFT)
            + "_AXIS_RIGHT_" + normalize(valVerticalRIGHT) + ":" + normalize(valHorizontalRIGHT));

    rAF(inputLoop);
}

// this function updates the visuals with the values recieved from the server
function updateVisuals(message) {
    
     if (message.charAt(5) === 'A') {
        $("#A").addClass("pressedA");
    } else {
        $("#A").removeClass("pressedA");
    }
    
    if (message.charAt(6) === 'B') {
        $("#B").addClass("pressedB");
    } else {
        $("#B").removeClass("pressedB");
    }
    
    if (message.charAt(7) === 'X') {
        $("#X").addClass("pressedX");
    } else {
        $("#X").removeClass("pressedX");
    }
    
    if (message.charAt(8) === 'Y') {
        $("#Y").addClass("pressedY");
    } else {
        $("#Y").removeClass("pressedY");
    }
    
    $("#axis1").css({"margin-top" : valVerticalLEFT, 
        "margin-left" : valHorizontalLEFT}); 
    
    $("#axis2").css({"margin-top" : valVerticalRIGHT, 
        "margin-left" : valHorizontalRIGHT}); 
}

// web app visuals (menubar, icons ...) when gamepad is connected
function addDisplay() {
    $("#notification-icon").attr("src","img/appbar.alert.white.svg");
    $("#notification-text").html("hold X to arm the quadcopter");
    $("#gamepad-icon").show();
    $("#gamepad").show();
}

function removeDisplay() {  
    $("#notification-icon").attr("src","img/appbar.alert.white.svg");
    $("#notification-text").html("please connect your gamepad");
    $("#gamepad-icon").hide();
    $("#gamepad").hide();
}

function checkGamepad() {

    // only works with xbox gamepad at the moment
    if(gamepad.id.indexOf(gamepadID) > -1) {
        console.log("xbox");
    }else{
        console.log("playstation");
    }
}

function checkOS() {
    
    // only checks if the user is using a mac
    if(navigator.appVersion.indexOf("Mac") !== -1) {
        gamepadID = "45e-28e-Controller";
        verticalRIGHT = 3;
        horizontalRIGHT = 2;
    }
}

// converts a value to an integer
function toInt(value) {
    return value | 0;
}

// returns a normalized value between 100 and -100 for a given axis
function axisValue(axisNum) {
    if (axisNum === 1){
        var pct = toInt((gamepad.axes[axisNum]* -1) * 100);
    }else{
        var pct = toInt(gamepad.axes[axisNum] * 100);
    }
    if (pct < 10 && pct > -10) {
        pct = 0;
    }
    return pct;
}

function normalize(value){
    value = value * 5 + 1250;
    return value;
}

// checks if a button is pressed
function buttonPressed(b) {
    
    if (typeof (b) === "object") {
        return b.pressed;
    }
    return b === 1.0;
}

// returns a the axis values from a given message
function parsed(message, element) {
    // TO-DO!
    var val = null; 
    return val;
}

window.addEventListener("gamepadconnected", connect);
window.addEventListener("gamepaddisconnected", disconnect);