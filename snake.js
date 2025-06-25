// Snake game in HTML Canvas using JavaScript  
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Snake Game</title>
    <style>
        body {
            background: #222;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        canvas {
            background: #111;
            box-shadow: 0 0 20px #333;
            display: block;
        }
        #score {
            color: #fff;
            text-align: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 24px;
            margin-bottom: 10px;
            letter-spacing: 2px;
            user-select: none;
        }
    </style>
</head>
<body>
    <div>
        <div id="score">Score: 0</div>
        <canvas id="game" width="400" height="400"></canvas>
    </div>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const scoreEl = document.getElementById('score');

        // Game settings
        const gridSize = 20; // 20x20 grid
        const tileSize = canvas.width / gridSize;
        const snakeColor = '#38b000';
        const foodColor = '#f72585';
        const snakeBorder = '#1a6600';

        // Game state
        let snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        let direction = { x: 1, y: 0 }; // moving right
        let nextDirection = { x: 1, y: 0 };
        let food = randomFood();
        let score = 0;
        let gameOver = false;
        let speed = 130; // ms per move

        function randomFood() {
            let newFood;
            while (true) {
                newFood = {
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                };
                // Ensure food is not placed on the snake
                if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
                    return newFood;
                }
            }
        }

        function drawRect(x, y, color, border = false) {
            ctx.fillStyle = color;
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            if (border) {
                ctx.strokeStyle = snakeBorder;
                ctx.lineWidth = 2;
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw food
            drawRect(food.x, food.y, foodColor);

            // Draw snake
            for (let i = 0; i < snake.length; i++) {
                drawRect(snake[i].x, snake[i].y, snakeColor, true);
            }
        }

        function update() {
            if (gameOver) return;

            // Update direction
            direction = nextDirection;

            // Calculate new head
            const newHead = {
                x: snake[0].x + direction.x,
                y: snake[0].y + direction.y
            };

            // Collision with walls
            if (
                newHead.x < 0 || newHead.x >= gridSize ||
                newHead.y < 0 || newHead.y >= gridSize
            ) {
                endGame();
                return;
            }

            // Collision with self
            if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                endGame();
                return;
            }

            // Add new head to snake
            snake.unshift(newHead);

            // Check if eating food
            if (newHead.x === food.x && newHead.y === food.y) {
                score++;
                scoreEl.textContent = `Score: ${score}`;
                food = randomFood();
                // Optional: speed up the snake every 5 points
                if (score % 5 === 0 && speed > 60) {
                    speed -= 10;
                }
            } else {
                snake.pop(); // Remove tail
            }
        }

        function gameLoop() {
            update();
            draw();
            if (!gameOver) {
                setTimeout(gameLoop, speed);
            }
        }

        function endGame() {
            gameOver = true;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
            ctx.fillStyle = "#fff";
            ctx.font = "36px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
            ctx.font = "24px Arial";
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 35);
            ctx.font = "18px Arial";
            ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 60);
        }

        function resetGame() {
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ];
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            food = randomFood();
            score = 0;
            scoreEl.textContent = `Score: ${score}`;
            gameOver = false;
            speed = 130;
            draw();
            setTimeout(gameLoop, speed);
        }

        // Handle keyboard input
        window.addEventListener('keydown', e => {
            if (gameOver && e.code === 'Space') {
                resetGame();
                return;
            }
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 's':
                    if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                    if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                    break;
            }
        });

        // Initial draw and start game loop
        draw();
        setTimeout(gameLoop, speed);
    </script>
</body>
</html>
  
