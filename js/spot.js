const charSets = {
    numeric: "0123456789",
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    greek: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
    runes: "ᚠᚥᚧᚨᚩᚬᚭᚻᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛤ",
    braille: "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿",
}

// Sound effects (reuse simon.js audio files)
const spotSndCorrect = new Audio('audio/phase_completion_bgm.mp3');
const spotSndError = new Audio('audio/error_bgm.mp3');
const spotSndStart = new Audio('audio/intro_bgm.mp3');
const spotSndEnd = new Audio('audio/phase_completion_bgm.mp3');

const spotSettings = {
    spotGridSize: 5,
    charSet: charSets.braille,
    currentSpot: null,
    targetChar: null,
    timer: 5000,
    required: 10,
    currentScore: 0,
}

let spotGridSize = 5;
let spotInterval;
let currentSpotTarget;
let preventClick = false;


function createSpotGrid(gridSize) {
    let squares = gridSize * gridSize;
    let addSquare = "";
    $("#spot-grid").empty();

    for (let i = 0; i < squares; i++) {
        addSquare += `<div class="spot-grid-square" data-spot="${i}"><div class="spot-square-text">?</div></div>`
    }

    $("#spot-grid").append(addSquare);
    $("#spot-grid").css({
        "display": "grid",
        "grid-template-columns": `repeat(${gridSize}, 1fr)`,
        "grid-template-rows": `repeat(${gridSize}, 1fr)`
    });
}
    
function updateSpotSquares() {
    clearInterval(spotInterval);
    spotInterval = setInterval(() =>{
        const randomSquare = Math.floor(Math.random() * spotSettings.spotGridSize*spotSettings.spotGridSize);
        if (randomSquare == spotSettings.currentSpot) return

        const randomChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
        if (randomChar == spotSettings.targetChar) return

        $(`[data-spot=${randomSquare}] .spot-square-text`).fadeOut(300, function() {
            $(`[data-spot=${randomSquare}] .spot-square-text`).text(randomChar);
            $(`[data-spot=${randomSquare}] .spot-square-text`).fadeIn(300)
        })
    }, 30)
}

function resetSpotTimer() {
    $("#spot-timer-bar-inner").css("width", "100%");
    $("#spot-timer-bar-inner").animate({
        width: "0%",
    }, {
        duration: spotSettings.timer,
        complete: () => {
            endSpotGame(false)
        }
    })
}

function startSpotGame(settings) {
    activeGame = "spot";
    spotSndStart.currentTime = 0;
    spotSndStart.play();
    settings.gridSize > 10 ? 10 : settings.gridSize;

    spotSettings.spotGridSize = settings.gridSize;
    spotSettings.charSet = charSets[settings.charSet];
    spotSettings.timer = settings.timeLimit;
    spotSettings.required = settings.required;

    createSpotGrid(settings.gridSize);

    displayScreen("spot", "start");
    $("#spot-timer-bar-inner").css("width", "100%");
    $("#spot-container").fadeIn();
     spotSettings.targetChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
    $("#spot-target").text(spotSettings.targetChar)
   
    spotSettings.currentSpot = Math.floor(Math.random() * spotSettings.spotGridSize*spotSettings.spotGridSize);
    
    updateSpotSquares();

    $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).text(spotSettings.targetChar);

    startTimeout = setTimeout(() => {
        if (activeGame == "spot") {
            hideScreen();
            $("#spot-grid").show();
            $("#spot-timer-container").show();
            $("#spot-target").fadeIn();
            $("#spot-timer-bar-inner").css("width", "100%");
            
            $("#spot-timer-bar-inner").animate({
                width: "0%",
            }, {
                duration: spotSettings.timer,
                complete: () => {
                    endSpotGame(false)
                }
            })
        }
    }, 4000);

}

function endSpotGame(win) {
    if (activeGame != "spot") return;

    clearInterval(spotInterval);
    $("#spot-timer-bar-inner").stop();
    $("#spot-grid").hide();
    $("#spot-timer-container").hide();
    $("#spot-target").hide();
    
    if (win) {
        spotSndCorrect.currentTime = 0;
        spotSndCorrect.play();
        alert("🎉 SUCCESS! Well done! You found all the targets!");
    } else {
        spotSndError.currentTime = 0;
        spotSndError.play();
        alert("❌ TIME'S UP! Better luck next time!");
    }

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
    
    spotSettings.currentScore = 0;
    activeGame = null;
}

function resetSpot() {
    hideScreen();
    clearInterval(spotInterval);
    $("#spot-timer-bar-inner").stop();
    $("#spot-grid").hide();
    $("#spot-timer-container").hide();
    $("#spot-target").hide();
    spotSettings.currentScore = 0;
}

$("#spot-grid").on("click", ".spot-grid-square", function() {
    if ($(this).data("spot") == spotSettings.currentSpot && !preventClick) {
        spotSettings.currentScore++;
        if (spotSettings.currentScore >= spotSettings.required) {
            endSpotGame(true)
            return
        }

        $("#spot-timer-bar-inner").stop();
        $("#spot-timer-bar-inner").css("width", "100%");
        preventClick = true;
        let newSpotTarget;
        do {
            newSpotTarget = Math.floor(Math.random() * spotSettings.spotGridSize*spotSettings.spotGridSize);
        } while (newSpotTarget == spotSettings.currentSpot);

        let randomChar;
        do {
            randomChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
        } while (randomChar == spotSettings.targetChar);

        clearInterval(spotInterval);

        $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).fadeOut(400, function() {
            $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).text(randomChar);
            $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).fadeIn(400)
            spotSettings.currentSpot = newSpotTarget;
            $(`[data-spot=${newSpotTarget}] .spot-square-text`).text(spotSettings.targetChar);
            updateSpotSquares()
            preventClick = false;

            resetSpotTimer();
        })

    }
})