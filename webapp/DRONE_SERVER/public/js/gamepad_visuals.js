
// web app visuals (menubar, icons ...) when gamepad is connected
function addDisplay() {  
    $("#gamepad").removeClass("fade");
}

function removeDisplay() {
    $("#gamepad").addClass("fade");
}

function displaySuccess(message) {
    $("#info-panel").removeClass("alert-warning");
    $("#info-panel").removeClass("alert-danger");
    $("#info-panel").removeClass("alert-info");
    $("#info-panel").addClass("alert-success");
    $("#notification-text").html(message);
}

function displayDanger(message) {
    $("#info-panel").removeClass("alert-warning");
    $("#info-panel").removeClass("alert-info");
    $("#info-panel").removeClass("alert-sucess");
    $("#info-panel").addClass("alert-danger");
    $("#notification-text").html(message);
}

function displayWarning(message) {
    $("#info-panel").removeClass("alert-warning");
    $("#info-panel").removeClass("alert-info");
    $("#info-panel").removeClass("alert-danger");
    $("#info-panel").addClass("alert-warning");
    $("#notification-text").html(message);
}

function displayInfo(message) {
    console.log(message);
    $("#info-panel").removeClass("alert-danger");
    $("#info-panel").removeClass("alert-warning");
    $("#info-panel").removeClass("alert-sucess");
    $("#info-panel").addClass("alert-info");   
    $("#notification-text").html(message);
}

function removeInfo() {
    $("#info-panel").addClass("fade");
}

function addInfo() {
    $("#info-panel").removeClass("fade");
}

function displayButton(id) {
    $("#" + id).addClass("pressed" + id);
}

function hideButton(id) {
    $("#" + id).removeClass("pressed" + id);
}


// this function updates the visuals with the values recieved from the server
function updateVisuals(message) {
    
    if (parseMessage(message, "X") === "1") {
        $("#X").addClass("pressedX");
    } else {
        $("#X").removeClass("pressedX");
    }
    
    if (parseMessage(message, "Y") === "1") {
        $("#Y").addClass("pressedY");
    } else {
        $("#Y").removeClass("pressedY");
    }
    
    $("#axis1").css({"margin-top" : parseMessage(message, "verticalLEFT") + "px", 
        "margin-left" : parseMessage(message, "horizontalLEFT") + "px"}); 
    
    $("#axis2").css({"margin-top" : parseMessage(message, "verticalRIGHT") + "px", 
        "margin-left" : parseMessage(message, "horizontalRIGHT") + "px"}); 
    
    $("#speed").html(" " + parseMessage(message, "speed"));
    $("#altitude").html(" " + parseMessage(message, "altitude"));
}

// changes the values from the server to the values needed by the UI
function parseMessage(message, axis) {
    
    var commands = message.split(":");
    
    if(axis === "verticalLEFT") {
        return normalize(parseInt(commands[2])); 
    }else if(axis === "X"){
        return commands[7];
    }else if(axis === "Y"){
        return commands[6];
    }else if(axis === "speed") {
        return commands[11];
    }else if(axis === "altitude") {
        return commands[10];
    }else if(axis === "horizontalLEFT") {
        return normalize(parseInt(commands[0]));
    }else if(axis === "horizontalRIGHT") {
        return normalize(parseInt(commands[1]));
    }else if(axis === "verticalRIGHT") {
        return normalize(parseInt(commands[3]));
    }else {
        console.log("ERROR: axis not recognized");
    }   
} 

// changes the values from 1500 : 0 to 100 : -100
function normalize(value) {
    return value / 5 - 245;
}

function updateProgressBar(value, look) {
    $("#progress-bar").css("width", value + "%");
    $("#progress-bar").removeClass("progress-bar-info");
    $("#progress-bar").removeClass("progress-bar-danger");
    $("#progress-bar").addClass("progress-bar-" + look);
}

function removeProgressBar() {
     $("#progress-bar").addClass("fade");
}

function addProgressBar() {
     $("#progress-bar").removeClass("fade");
}