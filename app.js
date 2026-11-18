const StartBtn = document.getElementById("StartBtn");
const Note = document.querySelector("#Note");

const ScoreLable = document.querySelector("#ScoreLable");
const TimeLable = document.querySelector("#TimeLable");
const StrikesLable = document.querySelector("#StrikesLable");
const NoteP=document.querySelector("#NoteP")
const H2P=document.querySelector("#H2P")

const Holes = document.querySelectorAll(".hole");

let Score = 0;
let timeLeft = 60;
let timerId = null;
let Strikes = 0;
let HitTimerId = null;
let activeHole = null;
let gameRunning = false;
let lose=false

function moles() {
    if (!gameRunning) return;

    Holes.forEach(hole => {
        hole.style.backgroundImage = 'url("../assets/hole.png")';
        hole.onclick = null;
    });

    const randomNumber = Math.floor(Math.random() * 10);
    const randomHole = Holes[randomNumber];

    activeHole = randomHole;
    randomHole.style.backgroundImage = 'url("assets/mole.png")';

    randomHole.onclick = () => {
        if (!gameRunning || activeHole !== randomHole) return;
        playHitSound();

        Score += 100;
        ScoreLable.textContent = "Score: " + Score;
        randomHole.onclick=null
        

        randomHole.style.backgroundImage = 'url("../assets/hit_mole.png")';

        clearTimeout(HitTimerId);
        HitTimerId = setTimeout(moles, 500);
 
    };


    HitTimerId = setTimeout(() => {
        if (activeHole === randomHole && gameRunning) {
            Strikes++;
            StrikesLable.textContent = "Strikes: " + Strikes; 
        }

        if(Strikes>=3){
            lose=true
            endGame()
        }
         moles();
    }, 1200);
}

function updateTimer() {
    timeLeft--;
    TimeLable.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    gameRunning = false;

    clearInterval(timerId);
    clearTimeout(HitTimerId);

    Holes.forEach(hole => {
        hole.style.backgroundImage = 'url("../assets/hole.png")';
        hole.onclick = null;
    });

    Note.style.visibility="visible"
    if(lose===false){
    playWinSound();
    H2P.textContent= "You Win!!!!!!"
    NoteP.style.textAlign = "center";
    NoteP.textContent= "Your Score is:"+Score;
    }else if(lose===true){
        playLoseSound();
        H2P.textContent= "You Lose!!!!!!"
        NoteP.style.textAlign = "center";
        NoteP.textContent= "Your have reached 3 strikes"
    }

     stopTheme()
}

StartBtn.addEventListener("click", () => {
    gameRunning = true;

    Score = 0;
    Strikes = 0;
    timeLeft = 60;
    lose=false

    Note.style.visibility = "hidden";

    ScoreLable.style.visibility = "visible";
    TimeLable.style.visibility = "visible";
    StrikesLable.style.visibility = "visible";

    ScoreLable.textContent = "Score: " + Score;
    TimeLable.textContent = "Time: " + timeLeft;
    StrikesLable.textContent = "Strikes: " + Strikes;

    timerId = setInterval(updateTimer, 1000);

    moles();
    playTheme()
});

let audioContext;
let musicLoop;

function playNote(freq, startTime, duration, type = "square", volume = 0.08) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playTheme() {
   if (!audioContext || audioContext.state === "closed") {
        audioContext = new AudioContext();
    }

    clearInterval(musicLoop);

    const melody = [
        659, 784, 988, 784,
        659, 523, 659, 784,
        988, 880, 784, 659,
        523, 659, 784, 523
    ];

    const bass = [
        131, 131, 165, 165,
        196, 196, 165, 165
    ];

    let step = 0;

    musicLoop = setInterval(() => {
        const now = audioContext.currentTime;

        playNote(melody[step % melody.length], now, 0.16);
        playNote(bass[step % bass.length], now, 0.3, "triangle", 0.04);

        step++;
    }, 180);
}

function stopTheme() {
    clearInterval(musicLoop);
}

function playHitSound() {
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
}

function playWinSound() {
    const now = audioContext.currentTime;

    const notes = [523, 659, 784, 1047, 1318];

    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        const start = now + i * 0.15;

        oscillator.type = "square";
        oscillator.frequency.value = freq;

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(start);
        oscillator.stop(start + 0.2);
    });
}

function playLoseSound() {
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(500, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
}