// session 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";

// interval
let gameInterval = null;

// session 2
let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

// session 2
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

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
}
// session 2
function startGame() {
  if (gameInterval !== null) return; // Prevent multiple intervals

  gameInterval = setInterval(() => {
    // session 2
    applyGravity();
  }, 10);
}

// session 2
// Start button (optional extra)
function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
}
