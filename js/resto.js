let gameStarted = false;
let seconds = 25;
let correctCode = [];
let userGuess = [];
let startTime; // Variable to track the start time of the timer
let animationFrameId; // Variable to store the requestAnimationFrame reference

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('play-again-btn').addEventListener('click', startGame);  // Use startGame for Play Again
    document.addEventListener('keydown', handleKeyPress);
});

// Start the game (either on initial start or play again)
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('play-again-btn').style.display = 'none'; // Hide play again button initially
        resetInputs();
        seconds = 25;
        correctCode = generateRandomCode();
        startTimer();
        document.getElementById('status').style.display = 'none'; // Hide the status text at the start
        document.addEventListener('keydown', handleKeyPress); // Enable keypress handler
    } else {
        // If game is already started, reset it for the next round
        resetGame();
    }
}

// Reset game state (for play again scenario)
function resetGame() {
    // Reset everything (inputs, timer, etc.)
    resetInputs();
    seconds = 25;
    correctCode = generateRandomCode();
    document.getElementById('status').style.display = 'none'; // Hide the status text
    document.getElementById('time-bar').style.width = '100%'; // Reset the timer bar
    cancelAnimationFrame(animationFrameId); // Stop any ongoing animation
    startTimer(); // Start the timer again
    document.getElementById('play-again-btn').style.display = 'none'; // Hide play again button until game ends
}

// Generate a 4-digit random code where each digit is unique and between 1 and 9
function generateRandomCode() {
    let code = [];
    let availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Numbers between 1 and 9

    for (let i = 0; i < 4; i++) {
        // Randomly pick a number from the available pool
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const randomNum = availableNumbers.splice(randomIndex, 1)[0]; // Remove the chosen number from the array
        code.push(randomNum);
    }

    return code;
}

// Reset input fields and borders
function resetInputs() {
    const boxes = document.querySelectorAll('.number-box');
    boxes.forEach(box => box.textContent = ''); // Clear all boxes
    clearBorders();
}

// Clear the borders of all input boxes
function clearBorders() {
    const boxes = document.querySelectorAll('.number-box');
    boxes.forEach(box => {
        box.style.borderColor = '#333'; // Default border color
    });
}

// Start the countdown timer and update the time bar smoothly over 25 seconds
function startTimer() {
    startTime = performance.now(); // Capture the start time of the game
    animationFrameId = requestAnimationFrame(updateTimeBarSmoothly); // Start the smooth update
}

// Update the time bar width based on the elapsed time
function updateTimeBarSmoothly(currentTime) {
    const elapsedTime = currentTime - startTime; // Time elapsed in milliseconds
    const progress = elapsedTime / 25000; // Divide by 25000 to map it to the 25-second duration
    const newWidth = 100 - (progress * 100); // Calculate the new width based on elapsed time

    // Update the width of the timer bar smoothly
    document.getElementById('time-bar').style.width = `${newWidth}%`;

    // Stop the animation when 25 seconds have passed
    if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateTimeBarSmoothly); // Continue the animation until 25 seconds
    } else {
        finishGame(false); // Time's up, game over
    }
}

// Handle key press (1-9) to automatically enter the number into the next available spot
function handleKeyPress(event) {
    // Disable keypress if the game is over (time's up or success)
    if (!gameStarted) return; // If game isn't started or finished, don't allow input

    if (event.key >= '1' && event.key <= '9') { // Only allow 1-9 keys
        // Find the first empty number box
        const boxes = document.querySelectorAll('.number-box');
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].textContent === '') {
                boxes[i].textContent = event.key; // Enter the number into the box
                checkGuess(); // Check the guess after entering a number
                break;
            }
        }
    }
}

// Check the user's guess after they've entered all numbers
function checkGuess() {
    const boxes = document.querySelectorAll('.number-box');
    userGuess = Array.from(boxes).map(box => parseInt(box.textContent));

    if (userGuess.some(isNaN) || userGuess.some(num => num < 1 || num > 9)) {
        return;
    }

    let allCorrect = true;
    let correctNumbers = [];  // Track numbers that are correct but not in the correct position

    // Step 1: First pass - Check for exact matches (correct number in correct position)
    for (let i = 0; i < 4; i++) {
        const box = boxes[i];
        if (userGuess[i] === correctCode[i]) {
            box.style.borderColor = 'green';  // Correct number in the correct position
        } else {
            box.style.borderColor = '#333';  // Reset border for incorrect numbers
            correctNumbers.push(userGuess[i]);  // Keep track of numbers that are correct but not in the correct position
            allCorrect = false;
        }
    }

    // Step 2: Second pass - Check for correct numbers in the wrong position
    for (let i = 0; i < 4; i++) {
        const box = boxes[i];
        if (userGuess[i] !== correctCode[i] && correctCode.includes(userGuess[i])) {
            // If the number is correct but in the wrong position, apply a blue border
            if (box.style.borderColor !== 'green') { // Avoid overwriting green border
                box.style.borderColor = 'orange';  // Correct number in the wrong position
            }
        }
    }

    // If all numbers are correct, end the game
    if (allCorrect) {
        finishGame(true);  // Success: Correct guess
    } else {
        // Short delay before resetting the boxes to give the user time to see the result
        setTimeout(resetInputs, 1000);  // Reset after 1 second
    }
}

// Finish the game (win or lose)
function finishGame(win) {
    gameStarted = false;

    // Stop the animation frame to stop the timer bar from updating
    cancelAnimationFrame(animationFrameId); // Stop the timer animation

    // Show success/failure message
 

    // Auto-route to index after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);

    // Show Play Again button after game ends (in case user cancels navigation)
    document.getElementById('play-again-btn').style.display = 'inline-block'; // Show Play Again button
    document.getElementById('start-btn').style.display = 'none'; // Hide Start button

    // Remove the keydown listener to prevent any further key presses after game ends
    document.removeEventListener('keydown', handleKeyPress);
}
