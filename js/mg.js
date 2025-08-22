let container = document.getElementById('thermiteBlock');
let starter = document.getElementsByClassName('startButton')[0];
let intervalSetting = document.getElementsByClassName('settings')[0];

let currentPhase = 1;
let phaseIntervals = [8, 6, 4]; // Decreasing interval times for each phase
let selectedDifficulty = 'medium'; // Store the selected difficulty

// Get selected difficulty and store it
function getDifficulty() {
	const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');
	for (let input of difficultyInputs) {
		if (input.checked) {
			selectedDifficulty = input.value;
			return input.value;
		}
	}
	return selectedDifficulty; // return stored value if inputs not found
}

// Get number of blocks based on stored difficulty
function getNumberOfBlocks() {
	return selectedDifficulty === 'hard' ? 10 : 8; // medium = 8, hard = 10
}

function generateTable(){
	let board = document.createElement('table');
	for (i=0; i<6; i++){
		let row = document.createElement('tr');
		for (j=0; j<6; j++){
			let cell = document.createElement('td');
			row.append(cell);
		}
		board.append(row);
	}
}

function startCharge(){
	// Capture difficulty BEFORE clearing the container
	getDifficulty(); // This will store the selected difficulty
	
	container.innerHTML = '';
	
	// Show difficulty info using stored value
	const numberOfBlocks = getNumberOfBlocks();
	let difficultyInfo = document.createElement('p');
	difficultyInfo.innerText = `${selectedDifficulty.toUpperCase()} - Click numbers 1-${numberOfBlocks} in order`;
	difficultyInfo.className = 'difficulty-info';
	difficultyInfo.style.fontSize = '16px';
	difficultyInfo.style.color = '#ccc';
	difficultyInfo.style.marginBottom = '20px';
	container.append(difficultyInfo);
	
	let warning = document.createElement('p');
	warning.innerText = 'Get Ready!';
	warning.className = 'middleText';
	container.append(warning);

	function conductThermite(){
		container.innerHTML = '';
		
		// Use stored difficulty
		const numberOfBlocks = getNumberOfBlocks();
		
		// Show difficulty info using stored value
		let difficultyInfo = document.createElement('p');
		difficultyInfo.innerText = `${selectedDifficulty.toUpperCase()} - Click numbers 1-${numberOfBlocks} in order`;
		difficultyInfo.className = 'difficulty-info';
		difficultyInfo.style.fontSize = '16px';
		difficultyInfo.style.color = '#ccc';
		difficultyInfo.style.marginBottom = '20px';
		container.append(difficultyInfo);
		
		let board = document.createElement('table');
		for (i=0; i<6; i++){
			let row = document.createElement('tr');
			for (j=0; j<6; j++){
				let cell = document.createElement('td');
				cell.className = `block ${i}-${j}`;
				row.append(cell);
			}
			board.append(row);
		}
		board.className = 'grid';
		container.append(board);

		let pairs = ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5', 
				'1-0', '1-1', '1-2', '1-3', '1-4', '1-5', 
				'2-0', '2-1', '2-2', '2-3', '2-4', '2-5', 
				'3-0', '3-1', '3-2', '3-3', '3-4', '3-5', 
				'4-0', '4-1', '4-2', '4-3', '4-4', '4-5', 
				'5-0', '5-1', '5-2', '5-3', '5-4', '5-5'];
		let pairings = [];
		while (pairings.length < numberOfBlocks) {
			let coord = pairs[Math.floor(Math.random()*36)];
			if (!pairings.includes(coord)){
				pairings.push(coord);
				let element = document.getElementsByClassName(coord)[0];
				element.className += ' highlighted';
				element.innerText += `${pairings.length}`;
			}
		}

		function challenge(){
			let correct = 0;
			for (i=0; i<pairings.length; i++){
				let element = document.getElementsByClassName(pairings[i])[0];
				element.classList += ' highlighted';
				element.innerText = '';
			}
			let failCon = setTimeout(thermiteFailure, phaseIntervals[currentPhase - 1] * 1000);
			for (i=0; i<pairings.length; i++){
				let pairing = pairings[i];
				let cell = document.getElementsByClassName(pairing)[0];
				cell.addEventListener('click', (e) => {
					e.preventDefault();
					if (pairings[correct] == pairing) {
						if (document.getElementsByClassName(pairing)[0].className.includes('highlighted')) {
							correct += 1;
						}
						if (correct == numberOfBlocks) {
							clearTimeout(failCon);
							if (currentPhase < 3) {
								currentPhase++;
								startCharge(); // Start next phase
							} else {
								thermiteSuccess();
							}
						}
					} else {
						if (pairings.includes(pairing)) {
							clearTimeout(failCon);
							thermiteFailure();
						}
					}
				});
			}
		}

		setTimeout(challenge, 5000);
	}

	setTimeout(conductThermite, 5000);
}

function thermiteSuccess(){
	let audio = new Audio('assets/welding.wav');
	audio.play();
	setTimeout(() => audio.pause(), 5000);
	container.innerHTML = '';
	let successMessage = document.createElement('p');
	successMessage.className = 'middleText success';
	successMessage.innerText = 'SUCCESS! Well done!';
	container.append(successMessage);
	
	// Create button container
	let buttonContainer = document.createElement('div');
	buttonContainer.style.display = 'flex';
	buttonContainer.style.gap = '20px';
	buttonContainer.style.justifyContent = 'center';
	buttonContainer.style.marginTop = '30px';
	container.append(buttonContainer);
	
	// Play Again button - refreshes the page
	let playAgainButton = document.createElement('button');
	playAgainButton.className = 'retry';
	playAgainButton.innerText = 'Play Again';
	playAgainButton.addEventListener('click', function() {
		location.reload(); // Refresh the page
	});
	buttonContainer.append(playAgainButton);
	
	// Home button - goes to game list
	let homeButton = document.createElement('button');
	homeButton.className = 'home';
	homeButton.innerText = 'Home';
	homeButton.addEventListener('click', function() {
		window.location.href = 'index.html'; // Go to game list
	});
	buttonContainer.append(homeButton);
}

function thermiteFailure(){
	container.innerHTML = '';
	let failureMessage = document.createElement('p');
	failureMessage.className = 'middleText fail';
	failureMessage.innerText = 'FAILED! Try again or go back to menu.';
	container.append(failureMessage);
	
	// Create button container
	let buttonContainer = document.createElement('div');
	buttonContainer.style.display = 'flex';
	buttonContainer.style.gap = '20px';
	buttonContainer.style.justifyContent = 'center';
	buttonContainer.style.marginTop = '30px';
	container.append(buttonContainer);
	
	// Retry button - refreshes the page
	let retryButton = document.createElement('button');
	retryButton.className = 'retry';
	retryButton.innerText = 'Retry';
	retryButton.addEventListener('click', function() {
		location.reload(); // Refresh the page
	});
	buttonContainer.append(retryButton);
	
	// Home button - goes to game list
	let homeButton = document.createElement('button');
	homeButton.className = 'home';
	homeButton.innerText = 'Home';
	homeButton.addEventListener('click', function() {
		window.location.href = 'index.html'; // Go to game list
	});
	buttonContainer.append(homeButton);
}

intervalSetting.addEventListener('submit', (e) => {
	e.preventDefault();
	startCharge();
})

starter.addEventListener('click', (e) => {
	e.preventDefault();
	startCharge();
});
