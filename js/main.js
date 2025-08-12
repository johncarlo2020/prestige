const scriptName = "glow_minigames";
const startEndScreens = {
    path: {
        height: "63.5vh",
        width: "60vh",
        icon: "fa-laptop-code",
        start: "Unrecognized user, connection required..",
        failTime: "Connection failed. Time Limit Reached.",
        failError: "Connection failed. Error Limit Reached.",
        success: "Connection successful. Access Granted",
    },
    spot: {
        height: "63vh",
        width: "60vh",
        icon: "fa-file-shield",
        start: "Files encrypted, user bypass required..",
        failTime: "Decryption failed. Time Limit Reached",
        success: "Files successfully decrypted.",
    },
    math: {
        height: "60vh",
        width: "60vh",
        icon: "fa-server",
        start: "Firewall active. Attempting to bypass..",
        failTime: "Bypass failed. Time Limit Reached",
        failError: "Bypass failed. Incorrect input.",
        success: "Firewall successfully bypassed.",
    }
}

// Default game settings for web browser
const defaultSettings = {
    path: {gridSize: 19, lives: 3, timeLimit: 10000},
    spot: {gridSize: 6, timeLimit: 8000, charSet: "braille", required: 10},
    math: {timeLimit: 300000}
}

let activeGame = null;
let startTimeout = null;
let endTimeout = null;

function startGameFromButton(gameName) {
    $("#game-selector").hide();
    startGame(gameName, defaultSettings[gameName]);
}

function endGameCallback(success) {
    console.log(`Game ended with result: ${success}`);
    
    setTimeout(() => {
        hideScreen();
        hideAllGameContainers();
        $("#game-selector").show();
        activeGame = null;
    }, 2000);
}

function hideAllGameContainers() {
    $("#path-container").hide();
    $("#spot-container").hide();
    $("#math-container").hide();
}

function startGame(game, settings) {
    switch(game) {
        case "path":
            startPathGame(settings);    
            break;
        case "spot":
            startSpotGame(settings);
            break;
        case "math":
            startMathGame(settings);
            break;
        }
}

function displayScreen(game, text) {
    const screenInfo = startEndScreens[game]
    $("#screen").css({
        "height": screenInfo.height,
        "width" : screenInfo.width,
    })

    $(".screen-icon").html(`<i class="fa-solid ${screenInfo.icon}"></i>`);
    $(".screen-text").text(screenInfo[text]);

    $("#screen").show();
}

function hideScreen() {
    $("#screen").hide();
}

function clearTimeouts() {
    clearTimeout(startTimeout);
    clearTimeout(endTimeout);
}

$(document).keyup(function(e) {
    if (e.key == "Escape" && activeGame) {
        endGameCallback(false);

        if (activeGame == "path") {
            resetPath();
        }

        if (activeGame == "spot") {
            resetSpot();
        }

        if (activeGame == "math") {
            resetMath();
        }
        clearTimeouts();
    }
})