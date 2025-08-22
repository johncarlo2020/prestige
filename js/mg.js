let container = document.getElementById('thermiteBlock');
let starter = document.getElementsByClassName('startButton')[0];
let intervalSetting = document.getElementsByClassName('settings')[0];

let currentPhase = 1;
let phaseIntervals = [8, 6, 4]; // Decreasing interval times for each phase

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
	container.innerHTML = '';
	let warning = document.createElement('p');
	warning.innerText = 'Get Ready!';
	warning.className = 'middleText';
	container.append(warning);

	function conductThermite(){
		container.innerHTML = '';
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
		while (pairings.length < 8) {
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
						if (correct == 8) {
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
	successMessage.innerText = 'GALING MO PA REIMBURSE KA KAY KAIRI';
	container.append(successMessage);
}

function thermiteFailure(){
	container.innerHTML = '';
	let failureMessage = document.createElement('p');
	failureMessage.className = 'middleText fail';
	failureMessage.innerText = 'BOBO MO SAYANG MG SAYO MAG BLOCKING K NALANG';
	container.append(failureMessage);
	let retryForm = document.createElement('form');
	retryForm.className = 'retryForm';
	retryForm.setAttribute('action', 'index.html');
	container.append(retryForm);
	let retryButton = document.createElement('button');
	retryButton.className = 'retry';
	retryButton.innerText = 'Retry';
	retryForm.append(retryButton);
	let homeForm = document.createElement('form');
	homeForm.className = 'homeForm';
	homeForm.setAttribute('action', 'index.html');
	container.append(homeForm);
	let homeButton = document.createElement('button');
	homeButton.className = 'home';
	homeButton.innerText = 'Home';
	homeForm.append(homeButton);
}

intervalSetting.addEventListener('submit', (e) => {
	e.preventDefault();
	startCharge();
})

starter.addEventListener('click', (e) => {
	e.preventDefault();
	startCharge();
});
