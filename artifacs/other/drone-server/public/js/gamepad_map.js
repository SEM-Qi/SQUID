/* stores the global values for the gamepad                            *
 * axis differ depending on OS: these values work on Windows and Linux */

var gamepadID = "X-Box";

var axis = {
    "verticalLEFT": 1,
    "horizontalLEFT": 0,
    "verticalRIGHT": 3,
    "horizontalRIGHT": 4
};

var button = {
    "A": {
        "id": 0,
        "value": 0
    },
    "B": {
        "id": 1,
        "value": 0
    },
    "X": {
        "id": 2,
        "value": 0
    },
    "Y": {
        "id": 3,
        "value": 0
    }
};

function check(gamepad) {

    // only works with xbox gamepad at the moment
    if (gamepad.id.indexOf(gamepadID) > -1) {
        console.log("xbox");
    } else {
        console.log("playstation");
        button.Y.id = 12;
        button.B.id = 13;
        button.A.id = 14;
        button.X.id = 15;
        
        axis.verticalLEFT = 1;
        axis.horizontalLEFT = 0;
        axis.verticalRIGHT = 2;
        axis.horizontalRIGHT = 3;
    }
}

function checkOS() {

    // only checks if the user is using a mac
    if (navigator.appVersion.indexOf("Mac") !== -1) {
        gamepadID = "45e-28e-Controller";
        axis.verticalRIGHT = 3;
        axis.horizontalRIGHT = 2;
    }
    else if (navigator.appVersion.indexOf("Win") !== -1) {
        gamepadID = "XBOX 360 For Windows";
    }
}
