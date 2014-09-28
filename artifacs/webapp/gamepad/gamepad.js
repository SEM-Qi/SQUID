/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

var controllers = {};
var rAF =   window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.requestAnimationFrame;

function connecthandler(e) {
    addgamepad(e.gamepad); 
    alert("controller: " + controllers[0]);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; 
  var d = document.createElement("div");
  d.setAttribute("id", "controller");
  var b = document.createElement("div");
  b.className = "buttons";
  // ADDS THE BUTTONS
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  // ADDS THE AXIS BARS
  for (var i=0; i<gamepad.axes.length; i++) {
    var e = document.createElement("progress");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("max", "2");
    e.setAttribute("value", "1");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.getElementById("notification-icon").src ="img/xbox.button.X.pressed.svg";
  document.getElementById("notification-text").innerHTML="hold start to arm the quadcopter";
  document.getElementById("icon-controller").style.display = "block";
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);	
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller");
  document.body.removeChild(d);
  delete controllers[gamepad.index];
  
    document.getElementById("icon-controller").style.display = "none";
    document.getElementById("notification-icon").src ="img/appbar.alert.white.svg";
    document.getElementById("notification-text").innerHTML="please connect your gamepad";
}

function updateStatus() {
  if (navigator.webkitGetGamepads) {
    scangamepads();
  }
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller");
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      var pct = Math.round(val * 100) + "%"
      b.style.backgroundSize = pct + " " + pct;
      if (pressed) {
        $.post("../php/gamepad/gamepad-data.php",
            {buttonA: 'true'}).done(function(){
                b.className = "button pressed";
            });
      } else {
        $.post("../php/gamepad/gamepad-data.php",
            {buttonA: 'false'}).done(function(){
                b.className = "button";
            });
      }
    }

    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
      //a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i] + 1);
    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.webkitGetGamepads();
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);
if (navigator.webkitGetGamepads) {
  setInterval(scangamepads, 500);
}
