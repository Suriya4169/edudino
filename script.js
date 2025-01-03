const dino = document.getElementById('dino');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit-answer');

let isJumping = false;
let isGameOver = false;
let score = 0;
let additionalScore = 0; // For correct answers
let cactusSpeed = 5; // Initial speed for cacti movement
let gravity = 0.98;
let currentQuestionAnswer = 0;

// Function to generate a random multiplication question
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 9) + 1;  // Random number between 1 and 9
  const num2 = Math.floor(Math.random() * 9) + 1;  // Random number between 1 and 9
  currentQuestionAnswer = num1 * num2;  // Save the correct answer
  return `${num1} * ${num2}`;  // Return the question in the form "X * Y"
}

// Function to update the question
function updateQuestion() {
  const question = generateQuestion();
  questionElement.textContent = `Question: ${question}`;
}

// Function to make the Dino jump
function jump() {
  if (isJumping) return;
  isJumping = true;

  let velocity = 18; // Increased upward velocity for higher jump
  let position = 20;

  const jumpInterval = setInterval(() => {
    if (velocity < 0 && position <= 20) {
      clearInterval(jumpInterval);
      isJumping = false;
      position = 20;
      dino.style.bottom = `${position}px`;
    } else {
      velocity -= gravity;
      position += velocity;
      dino.style.bottom = `${Math.max(position, 20)}px`; // Ensure Dino doesn't go below ground
    }
  }, 20);
}

// Function to spawn multiple cacti
function spawnCactus() {
  if (isGameOver) return;

  const cactus = document.createElement('div');
  cactus.classList.add('cactus');

  // Randomize cactus size
  const height = Math.random() * (50 - 20) + 20; // Between 20px and 50px
  const width = Math.random() * (25 - 15) + 15; // Between 15px and 25px
  cactus.style.height = `${height}px`;
  cactus.style.width = `${width}px`;

  // Spawn cactus on the right
  cactus.style.right = '-30px';
  gameContainer.appendChild(cactus);

  let cactusPosition = window.innerWidth;
  const cactusInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(cactusInterval);
      return;
    }

    // Move cactus
    cactusPosition -= cactusSpeed;
    cactus.style.right = `${window.innerWidth - cactusPosition}px`;

    // Check collision
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    if (
      dinoRect.right > cactusRect.left &&
      dinoRect.left < cactusRect.right &&
      dinoRect.bottom > cactusRect.top
    ) {
      isGameOver = true;
      alert(`Game Over! Final Score: ${score + additionalScore}`);
      location.reload();
    }

    // Remove cactus when off-screen
    if (cactusPosition + parseInt(width) < 0) {
      clearInterval(cactusInterval);
      cactus.remove();
      score++;
      scoreDisplay.textContent = `Score: ${score + additionalScore}`; // Include both scores
      cactusSpeed += 0.02; // Gradually increase speed
      updateQuestion();  // Update question when score changes
    }
  }, 20);

  // Spawn next cactus after random delay
  const delay = Math.random() * (2500 - 1500) + 1500; // Increased delay to 1.5s–2.5s
  setTimeout(spawnCactus, delay);
}

// Function to check the player's answer
function checkAnswer() {
  const playerAnswer = parseInt(answerInput.value);
  if (playerAnswer === currentQuestionAnswer) {
    additionalScore++; // Increase additional score for correct answer
    scoreDisplay.textContent = `Score: ${score + additionalScore}`; // Update the score display
    answerInput.value = ''; // Clear the input box
    updateQuestion(); // Update the question after answering correctly
  } else {
    alert('Incorrect answer! Try again.');
  }
}

// Start the game
document.addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'ArrowUp') && !isGameOver) {
    jump();
  }
});

submitButton.addEventListener('click', checkAnswer);

// Start spawning cacti and show the first question
spawnCactus();
updateQuestion();
