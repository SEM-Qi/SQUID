/* 
 * Ground Control - Gamepad 
 * Copyright (c) 2014 Aurélien Hontabat
 * 
 * Please read the Copyright file for further details.
 * 
 * This file writes the info from the gamepad serverside, aswell as 
 * display the current values from the gamepad on the website
 * 
 */

//  SERVERSIDE IS WORK IN PROGRESS

var rAF = window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame;

// executes when a controller is connected
function connectHandler(e) {
    addGamepadDisplay(e.gamepad);
}

// executes when a controller is disconnected
function disconnectHandler(e) {
    removeGamepadDisplay(e.gamepad);
}

// adds the gamepad visuals
function addGamepadDisplay(gamepad) {

    // add a div that contains the gamepad visuals
    var gamepadDiv = document.createElement("div");
    gamepadDiv.setAttribute("id", "gamepad");

    // add a div that contains the buttons
    var buttonDiv = document.createElement("div");
    buttonDiv.className = "buttons";

    // add the buttons
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        e.innerHTML = i;
        buttonDiv.appendChild(e);
    }

    gamepadDiv.appendChild(buttonDiv);

    //  add the axis

    document.body.appendChild(gamepadDiv);

    // update the menubar
    document.getElementById("notification-icon").src = "img/appbar.gauge.0.white.svg";
    document.getElementById("notification-text").innerHTML = "hold start to arm the quadcopter";
    document.getElementById("icon-controller").style.display = "block";

    rAF(updateDisplay);
}

// removes the gamepad visuals
function removeGamepadDisplay() {
    document.body.removeChild(document.getElementById("gamepad"));

    // update the menubar
    document.getElementById("icon-controller").style.display = "none";
    document.getElementById("notification-icon").src = "img/appbar.alert.white.svg";
    document.getElementById("notification-text").innerHTML = "please connect your gamepad";
}

// TO-DO: check gamepad in use
function checkGamepad(gamepad) {

}

// updates the visuals if a key is pressed
function updateDisplay() {
    rAF(updateDisplay);
}


// EventListeners
window.addEventListener("gamepadconnected", connectHandler);
window.addEventListener("gamepaddisconnected", disconnectHandler);

if (navigator.webkitGetGamepads) {
    setInterval(scangamepads, 500);
}
