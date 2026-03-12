// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 5,
    speed: 5,
    maxSpeed: 8
};

let playerScore = 0;
let computerScore = 0;

const keys = {};
const mousePos = { y: canvas.height / 2 };

// Event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.y = e.clientY - rect.top;
});

// Update functions
function updatePlayer() {
    // Use mouse position
    const targetY = mousePos.y - player.height / 2;
    player.y += (targetY - player.y) * 0.1; // Smooth movement

    // Arrow key support
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Keep player in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    // Simple AI: follow the ball
    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }

    // Keep computer in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        // Keep ball in bounds
        if (ball.y - ball.radius < 0) ball.y = ball.radius;
        if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
    }

    // Paddle collision detection
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width + ball.radius;

        // Add angle based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.05;

        // Increase speed slightly
        ball.speed = Math.min(ball.speed + 0.5, ball.maxSpeed);
        ball.dx = (ball.dx / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)) * ball.speed;
        ball.dy = (ball.dy / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)) * ball.speed;
    }

    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computer.x - ball.radius;

        // Add angle based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.05;

        // Increase speed slightly
        ball.speed = Math.min(ball.speed + 0.5, ball.maxSpeed);
        ball.dx = (ball.dx / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)) * ball.speed;
        ball.dy = (ball.dy / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)) * ball.speed;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvas.width / 4, 30);
    ctx.fillText(computerScore, (canvas.width * 3) / 4, 30);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    drawRectangle(player.x, player.y, player.width, player.height, '#fff');
    drawRectangle(computer.x, computer.y, computer.width, computer.height, '#fff');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fff');

    // Draw score
    drawScore();
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();