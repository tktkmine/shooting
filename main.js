const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

ctx.imageSmoothingEnabled = false;

const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

const playerImage = new Image();
playerImage.src = "player.png";

const player = {
  x: 400,
  y: 300,
  size: 32,
  speed: 4
};

const bullets = [];

let gameOver = false;
let startTime = Date.now();

function spawnBullet() {
  const side = Math.floor(Math.random() * 4);

  let x, y, vx, vy;

  const speed = 3 + Math.random() * 3;

  if (side === 0) {
    x = 0;
    y = Math.random() * canvas.height;
    vx = speed;
    vy = 0;
  }

  if (side === 1) {
    x = canvas.width;
    y = Math.random() * canvas.height;
    vx = -speed;
    vy = 0;
  }

  if (side === 2) {
    x = Math.random() * canvas.width;
    y = 0;
    vx = 0;
    vy = speed;
  }

  if (side === 3) {
    x = Math.random() * canvas.width;
    y = canvas.height;
    vx = 0;
    vy = -speed;
  }

  bullets.push({
    x,
    y,
    vx,
    vy,
    size: 12
  });
}

setInterval(spawnBullet, 400);

function update() {

  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;

    if (
      player.x < b.x + b.size &&
      player.x + player.size > b.x &&
      player.y < b.y + b.size &&
      player.y + player.size > b.y
    ) {
      gameOver = true;
    }
  });
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    playerImage,
    player.x,
    player.y,
    player.size,
    player.size
  );

  ctx.fillStyle = "red";

  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.size, b.size);
  });

  ctx.fillStyle = "white";
  ctx.font = "24px monospace";

  const survivalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  ctx.fillText(`TIME: ${survivalTime}`, 20, 40);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "48px monospace";
    ctx.fillText("GAME OVER", 260, 300);
  }
}

function gameLoop() {

  if (!gameOver) {
    update();
  }

  draw();

  requestAnimationFrame(gameLoop);
}

playerImage.onload = () => {
  gameLoop();
};
