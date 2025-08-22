let timer_start, timer_game, timer_finish, timer_time, timer_hide, letters, difficulty, valid_keys, timerStart;
let game_started = false;
let streak = 0;
let max_streak = 0;
let best_time = 0;
let errorPlayed = false;

// Sound effects
const thermiteSndIntro = new Audio('audio/intro_bgm.mp3');
const thermiteSndError = new Audio('audio/error_bgm.mp3');

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let readCookie = () => {
    // Get max streak from cookie
    let regex = new RegExp("max-streak_powerplant_"+difficulty[3]+"=([\\d]+)",'g');
    let cookie = document.cookie;
    if((cookie = regex.exec(cookie)) !== null){
        max_streak = cookie[1];
    }else{
        max_streak = 0;
    }
    // Get max streak from cookie
    let regex_time = new RegExp("best-time_powerplant_"+difficulty[3]+"=([\\d.]+)",'g');
    cookie = document.cookie;
    if((cookie = regex_time.exec(cookie)) !== null){
        best_time = parseFloat(cookie[1]);
    }else{
        best_time = 0;
    }
}

const getDifficulty = () => {
    let difficulty_selected = document.querySelector('input[name="difficulty"]:checked').value;

    switch(difficulty_selected){
        case 'easy':
            return ["wasd", 2000, 1000, 'easy'];
        case 'medium':
            return ["asdjkl", 1500, 750, 'medium'];
        case 'hard':
            return ["asdfhjkl", 750, 500, 'hard'];
        case 'insane':
            return ["asdfhjkl", 650, 400, 'insane'];
        case 'god':
            return ["asdfhjkl", 400, 300, 'insane'] // Increased speed for "insane"
    }
}

// Difficulty changed
document.querySelectorAll('input[name="difficulty"]').forEach((el) => {
    el.addEventListener('change', function(){
        streak = 0;
        reset();
    });
});
// Resets
document.querySelector('.btn_again').addEventListener('click', function(){
    streak = 0;
    reset();
});

let previousColor = '';

function getRandomColor() {
  const colors = ['#E08DEC', '#ACE05F', '#FFB501'];
  let randomIndex = Math.floor(Math.random() * colors.length);
  let color = colors[randomIndex];
  
  // Generate a new color until it is different from the previous one
  while (color === previousColor) {
    randomIndex = Math.floor(Math.random() * colors.length);
    color = colors[randomIndex];
  }
  
  previousColor = color;
  return color;
}

// Get the <div> element
const barDiv = document.querySelector('.minigame .bar');
// Set a random color to the background of the <div>
barDiv.style.backgroundColor = getRandomColor();

document.addEventListener("keydown", function(ev) {
    let key_pressed = ev.key;
    if(game_started && valid_keys.includes(key_pressed)){
        let element = letters[0].el;
        let top = -590 * element.dataset.progress;
        if(top < -475 && top > -580 && key_pressed === element.textContent && barDiv.style.backgroundColor === element.style.color){//
            streak++;
            const barDiv = document.querySelector('.minigame .bar');
            barDiv.style.backgroundColor = getRandomColor();
         
        }
        else{
            stopTimer();
            // Play error BGM only once
            if (!errorPlayed) {
                thermiteSndError.currentTime = 0;
                thermiteSndError.play();
                errorPlayed = true;
            }
            document.querySelector('.minigame .splash1').classList.remove('hidden');
            document.querySelector('.minigame .splash2').classList.remove('hidden');
            document.querySelector('.minigame .hack').classList.add('hidden');
        }
        document.querySelector('.streak').innerHTML = streak;
    

        letters[0].stop();

        new mojs.Html({
            el: element,
            y: top,
            opacity: {
                1:0,
                duration: 500,
            },
            duration: 500,
            onComplete() {
                element.remove();
            },
        }).play();
        letters.splice(0,1);
    }
});

let createLetter = () => {
    let pos = random(1,4);
    const lettersElem = document.querySelector('.minigame .letters');
    let div = document.createElement('div');
    div.classList.add('letter', 'pos'+pos);
    div.innerHTML = difficulty[0].charAt(random(0, difficulty[0].length - 1));

    // Generate a random color from an array of colors
      const colors = ['#E08DEC', '#ACE05F', '#FFB501'];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    div.style.color = randomColor;

    lettersElem.append(div);
    let duration = difficulty[1];
    let lettersCnt = letters.length;
    letters.push(new mojs.Html({
        el: div,
        y: {
            0:-590,
            duration: duration,
            easing: 'linear.none',
            onProgress (p) {
                div.dataset.progress = p;
            },
        },
        opacity: {
            0:1,
            duration: 200,
            easing: 'linear.none'
        },
        duration: duration,
        onComplete() {
            if (div.style.color === barDiv.style.backgroundColor) {
                stopTimer();
                // Play error BGM only once
                if (!errorPlayed) {
                    thermiteSndError.currentTime = 0;
                    thermiteSndError.play();
                    errorPlayed = true;
                }
                document.querySelector('.minigame .splash1').classList.remove('hidden');
                document.querySelector('.minigame .splash2').classList.remove('hidden');
                document.querySelector('.minigame .hack').classList.add('hidden');
            }
            letters.splice(0,1);
        },
        onUpdate() {
            if(game_started === false) this.pause();
        }
    }));
    letters[lettersCnt].then({
        opacity: 0,
        duration: 500,
        onComplete() {
            div.remove();
        },
    }).play()
}


function reset(restart = true){
    game_started = false;

    resetTimer();
    clearTimeout(timer_start);
    clearTimeout(timer_game);
    clearTimeout(timer_finish);
    clearTimeout(timer_hide);

    if(restart){
        document.querySelector('.minigame .hack').classList.add('hidden');
        document.querySelector('.minigame .splash').classList.remove('hidden');
        document.querySelector('.minigame .letters').innerHTML = '';
        barDiv.style.backgroundColor = getRandomColor();
        start();
    }
}

function start(){

    document.querySelector('.minigame .splash1').classList.add('hidden');
    document.querySelector('.minigame .splash2').classList.add('hidden');

    // Reset error played flag and play intro BGM
    errorPlayed = false;
    thermiteSndIntro.currentTime = 0;
    thermiteSndIntro.play();

    timer_start = sleep(3000, function(){
        document.querySelector('.minigame .splash').classList.add('hidden');
        document.querySelector('.minigame .hack').classList.remove('hidden');

        difficulty = getDifficulty();
        readCookie();

        document.querySelector('.streak').innerHTML = streak;

        valid_keys = difficulty[0].split('');
        letters = [];
        game_started = true;

        timer_game = setInterval(createLetter, difficulty[2]);

        startTimer();

    });
}

function startTimer(){
    timerStart = new Date();
    timer_time = setInterval(timer,1);
}
function timer(){
    let timerNow = new Date();
    let timerDiff = new Date();
    timerDiff.setTime(timerNow - timerStart);
    let ms = timerDiff.getMilliseconds();
    let sec = timerDiff.getSeconds();
    if (ms < 10) {ms = "00"+ms;}else if (ms < 100) {ms = "0"+ms;}
    document.querySelector('.streaks .time').innerHTML = sec+"."+ms;
}
function stopTimer(){
    clearInterval(timer_time);
}
function resetTimer(){
    clearInterval(timer_time);
    document.querySelector('.streaks .time').innerHTML = '0.000';
}

start();
