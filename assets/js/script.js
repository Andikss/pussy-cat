const startButton = document.getElementById("start-button");
const startScreen = document.querySelector(".start-screen");
const playScreen  = document.querySelector(".play-screen");
const character   = document.getElementById("character");
const enemy       = document.getElementById("enemy");
const coin        = document.getElementById("coin");
const backsound   = document.getElementById("backgroundMusic");
const coinSound   = document.getElementById("coinSound");

let moveX = 0;
let moveY = 0;
let score = 0;
let gameover = false;
const moveAmount = 5;

// Start Game 
startButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Initialize PlayScreen
    startScreen.classList.add('hidden'); 
    playScreen.classList.remove('hidden'); 
    backsound.play();

    // Initialize Score
    document.getElementById("score").textContent = score;

    // Initialize character position
    const centerX = window.innerWidth / 2 - character.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - character.offsetHeight / 2;
    character.style.left = `${centerX}px`;
    character.style.top = `${centerY}px`;

    // Initialize enemy position
    let enemyX = Math.random() * (window.innerWidth - enemy.offsetWidth);
    let enemyY = Math.random() * (window.innerHeight - enemy.offsetHeight);
    enemy.style.left = `${enemyX}px`;
    enemy.style.top = `${enemyY}px`;

    // Move character function
    const moveCharacter = () => {
        if (!gameover) {
            moveCharacterPosition();
            checkCoinCollision();
            moveEnemyTowardsCharacter();
            checkEnemyCollision();
        }
    };

    // Move the character
    const moveCharacterPosition = () => {
        let newX = parseInt(character.style.left) + moveX;
        let newY = parseInt(character.style.top) + moveY;

        // Wrap around the frame if character goes beyond the window boundaries
        if (newX < 0) {
            newX = window.innerWidth - character.offsetWidth;
        } else if (newX > window.innerWidth - character.offsetWidth) {
            newX = 0;
        }

        if (newY < 0) {
            newY = window.innerHeight - character.offsetHeight;
        } else if (newY > window.innerHeight - character.offsetHeight) {
            newY = 0;
        }

        character.style.left = `${newX}px`;
        character.style.top = `${newY}px`;
    };

    // Check collision with coin
    const checkCoinCollision = () => {
        if (isColliding(character, coin)) {
            coinSound.currentTime = 0;
            coinSound.play();
            score++;
            document.getElementById("score").textContent = score;
            respawnCoin();
        }
    };

    // Move the enemy towards the character
    const moveEnemyTowardsCharacter = () => {
        const dx = parseInt(character.style.left) - parseInt(enemy.style.left);
        const dy = parseInt(character.style.top) - parseInt(enemy.style.top);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2;
        const vx = (dx / distance) * speed;
        const vy = (dy / distance) * speed;
        enemyX += vx;
        enemyY += vy;
        enemy.style.left = `${enemyX}px`;
        enemy.style.top = `${enemyY}px`;
    };

    // Check collision with enemy
    const checkEnemyCollision = () => {
        if (isColliding(character, enemy)) {
            gameover = true;
            const gameOverSound = new Audio('assets/sound/gameover.mp3');
            gameOverSound.play();
            backsound.pause();
            gameOverSound.onended = () => {
                alert("Game Over!");
                window.location.reload();
            };
        }
    };

    // Check collision between two elements
    const isColliding = (element1, element2) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    };

    // Respawn the coin at a random position
    const respawnCoin = () => {
        const maxX = window.innerWidth - coin.offsetWidth;
        const maxY = window.innerHeight - coin.offsetHeight;
        const newX = Math.floor(Math.random() * maxX);
        const newY = Math.floor(Math.random() * maxY);
        coin.style.left = `${newX}px`;
        coin.style.top = `${newY}px`;
    };

    // Handle key down events
    const keyDownHandler = (e) => {
        if (!gameover) {
            if (e.key === "ArrowLeft" || e.key === "a") {
                moveX = -moveAmount;
                character.setAttribute('src', 'assets/img/cat-left.png'); 
            } else if (e.key === "ArrowRight" || e.key === "d") {
                moveX = moveAmount;
                character.setAttribute('src', 'assets/img/cat-right.png');
            } else if (e.key === "ArrowUp" || e.key === "w") {
                moveY = -moveAmount;
            } else if (e.key === "ArrowDown" || e.key === "s") {
                moveY = moveAmount;
            }
        }
    };

    // Handle key up events
    const keyUpHandler = (e) => {
        if (!gameover) {
            if ((e.key === "ArrowLeft" || e.key === "a") && moveX === -moveAmount) {
                moveX = 0;
            } else if ((e.key === "ArrowRight" || e.key === "d") && moveX === moveAmount) {
                moveX = 0;
            } else if ((e.key === "ArrowUp" || e.key === "w") && moveY === -moveAmount) {
                moveY = 0;
            } else if ((e.key === "ArrowDown" || e.key === "s") && moveY === moveAmount) {
                moveY = 0;
            }
        }
    };

    // Add event listeners for key down and key up events
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    // Move the character continuously
    setInterval(moveCharacter, 20);

    // Initial coin position
    respawnCoin();
});