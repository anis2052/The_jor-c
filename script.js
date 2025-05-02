// Game variables
// session 1
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let frame = 0;

// session 3
let gameInterval = null;
// session 3
const frame_time = 150;
let pipes = [];
let pipe_gap = 250;
// session 2
let game_state = "Start";

// session 4
let pipeSpeed = 3; // Default speed

function getDifficultySettings() {
  const selected = document.getElementById("difficulty-select").value;

  if (selected === "easy") {
    pipeSpeed = 2;
  } else if (selected === "medium") {
    pipeSpeed = 3;
  } else if (selected === "hard") {
    pipeSpeed = 5;
  }
}

// session 2
let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

// session 4 - High Score Feature
let highScore = localStorage.getItem("flappyHighScore") || 0;

// session 3
function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play(); // play only when actually scoring
  }
  score = newScore;
  // session 4
  score_display.textContent = "Score: " + score + " | Best: " + highScore;
}

// session 2
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    // session 4
    flapSound.play(); // Play flap sound

    bird_dy = -7;
  }
});

// session 2
function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";

  // session 4
  //  Add rotation: tilt up when rising, down when falling
  let angle = Math.min(Math.max(bird_dy * 2, -30), 90); // Clamp between -30 and 90 degrees
  bird.style.transform = `rotate(${angle}deg)`;
}

// session 2
function startGame() {
  if (gameInterval !== null) return; // Prevent multiple intervals

  // session 4
  highScore = localStorage.getItem("flappyHighScore") || 0;
  score_display.textContent = "Score: " + score + " | Best: " + highScore;

  gameInterval = setInterval(() => {
    // session 2
    applyGravity();
    // session 3
    movePipes();
    // session 3
    checkCollision();
    // session 3
    frame++;
    // session 4
    getDifficultySettings(); // update difficulty before starting

    // session 3
    // Every 200 frames (~2 seconds), create new pipe
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

// session 3
// Create pipe
function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  // Bottom pipe
  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

// session 3
// Move pipes
function movePipes() {
  for (let pipe of pipes) {
    // session 4 -> change from 3 to pipeSpeed
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

// session 3
// Check collision
function checkCollision() {
  let birdRect = bird.getBoundingClientRect();

  // session 4
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }

  // Collision with top and bottom
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }

  // Increase score when bird passes pipes (pipes are paired)
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      // Only check once for each top-bottom pair
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

// session 3
// End game
function endGame() {
  // session 4
  if (Number(score) > Number(highScore)) {
    localStorage.setItem("flappyHighScore", score);
  }
  hitSound.play();

  clearInterval(gameInterval);
  gameInterval = null;
  alert("Game Over! Your Score: " + score);
  resetGame();
}

// session 3
// Reset game
function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";
  bird.style.transform = `rotate(${0}deg)`;
}

// session 2
// Start button (optional extra)
start_btn.addEventListener("click", () => {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
});

// session 4

let musicMuted = false;

// Load sound effects
const flapSound = new Audio("sounds/temp.mp3");
const scoreSound = new Audio("sounds/temp.mp3");
const hitSound = new Audio("sounds/temp.mp3");

// Load background music
const backgroundMusic = new Audio("sounds/temp.mp3");
backgroundMusic.loop = true; // music should keep playing
backgroundMusic.volume = 0.5; // adjust volume
backgroundMusic.play();

// session 4 - Get the mute button
const muteBtn = document.getElementById("mute-btn");

muteBtn.addEventListener("click", () => {
  if (musicMuted) {
    backgroundMusic.play();
    muteBtn.textContent = "Mute Music";
  } else {
    backgroundMusic.pause();
    muteBtn.textContent = "Play Music";
  }
  musicMuted = !musicMuted;
});