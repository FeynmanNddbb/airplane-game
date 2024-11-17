const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.5; // 50% 宽度
canvas.height = window.innerHeight; // 100% 高度

let player;
let bullets = [];
let enemies = [];
let score = 0;
let gameStarted = false;
let gameOver = false;
let gameTime = 30; // 游戏时间设置为30秒
let gameInterval;

const enemyImages = [
    "imag/enemy1.png",
    "imag/enemy2.png",
    "imag/enemy3.png",
    "imag/enemy4.png"
];

class Player {
    constructor() {
        this.image = new Image();
        this.image.src = "imag/player.png"; // 自定义飞机图片路径
        this.x = canvas.width / 2 - 30;
        this.y = canvas.height - 100;
        this.width = 60;
        this.height = 60;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(direction) {
        const speed = 5;
        if (direction === "left" && this.x > 0) {
            this.x -= speed;
        } else if (direction === "right" && this.x < canvas.width - this.width) {
            this.x += speed;
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x + 25;
        this.y = y;
        this.radius = 5;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        const bulletSpeed = 5;
        this.y -= bulletSpeed;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.image = new Image();
        this.image.src = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += 3;
    }
}

function spawnEnemies() {
    if (enemies.length < 4) {
        const x = Math.random() * (canvas.width - 60);
        const enemy = new Enemy(x, 0);
        enemies.push(enemy);
    }
}

function handleCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemy.height
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                document.getElementById("hitSound").play();
                score++;
            }
        });
    });

    enemies.forEach((enemy) => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver = true;
            clearInterval(gameInterval);
            document.getElementById("finalScore").innerText = score;
            displayFinalMessage();
            document.getElementById("gameOver").style.display = "block";
        }
    });
}

function displayFinalMessage() {
    const finalMessage = document.getElementById("finalMessage");
    if (score > 40) {
        finalMessage.innerText = "太有实力了！";
    } else if (score > 20) {
        finalMessage.innerText = "你有什什什什么实力啊！";
    } else {
        finalMessage.innerText = "是人我吃！";
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    handleCollisions();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("得分: " + score, 10, 30);
    ctx.fillText("剩余时间: " + gameTime, canvas.width - 150, 30);
}

let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
    if (gameStarted && !gameOver) {
        if (event.key === " ") {
            const bullet = new Bullet(player.x, player.y);
            bullets.push(bullet);
        }
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function gameLoop() {
    if (!gameOver) {
        update();

        if (keys["ArrowLeft"]) {
            player.move("left");
        }
        if (keys["ArrowRight"]) {
            player.move("right");
        }

        if (Math.random() < 0.02) {
            spawnEnemies();
        }
        requestAnimationFrame(gameLoop);
    }
}

function showIntro() {
    document.getElementById("intro").style.display = "block";
}

function startGame() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    player = new Player();
    bullets = [];
    enemies = [];
    score = 0;
    gameStarted = true;
    gameOver = false;
    gameTime = 30;
    gameInterval = setInterval(() => {
        gameTime--;
        if (gameTime <= 0) {
            gameOver = true;
            clearInterval(gameInterval);
            document.getElementById("finalScore").innerText = score;
            displayFinalMessage();
            document.getElementById("gameOver").style.display = "block";
        }
    }, 1000);
    gameLoop();
}

document.addEventListener("keydown", (event) => {
    if (gameOver) {
        startGame(); // 重新开始游戏
    } else if (!gameStarted) {
        startGame(); // 开始游戏
    }
});

showIntro();
