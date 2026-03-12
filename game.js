// Pong Game Implementation in JavaScript

// Set up canvas
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Create the Pong Paddle
const paddleWidth = 10, paddleHeight = 100;
const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: 'WHITE', score: 0 };
const computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: 'WHITE', score: 0 };

// Create the Pong Ball
const ballSize = 10;
const ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, speed: 4, velocityX: 4, velocityY: 4, color: 'WHITE' };

// Move paddles
document.addEventListener('mousemove', event => {
    player.y = event.clientY - paddleHeight / 2;
});

// Game loop
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.size, ball.color);
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision detection
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision detection
    let playerPaddle = ball.x < canvas.width / 2 ? player : computer;
    if (collision(ball, playerPaddle)) {
        ball.velocityX = -ball.velocityX;
    }

    // Update computer paddle AI
    aiMove();

    // Check for scoring
    if (ball.x - ball.size < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        player.score++;
        resetBall();
    }

    // Draw scores
    ctx.fillStyle = 'WHITE';
    ctx.font = '50px Arial';
    ctx.fillText(player.score, canvas.width / 4, canvas.height / 5);
    ctx.fillText(computer.score, 3 * canvas.width / 4, canvas.height / 5);

    requestAnimationFrame(draw);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function collision(ball, paddle) {
    return ball.x - ball.size < paddle.x + paddle.width &&
           ball.x + ball.size > paddle.x &&
           ball.y - ball.size < paddle.y + paddle.height &&
           ball.y + ball.size > paddle.y;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
}

function aiMove() {
    let paddleCenter = computer.y + computer.height / 2;
    if (paddleCenter < ball.y) {
        computer.y += 4;
    } else if (paddleCenter > ball.y) {
        computer.y -= 4;
    }
}

// Start the game
requestAnimationFrame(draw);