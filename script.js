//Game Constants & Variables
let board = document.querySelector('.board');
let scoreBox = document.querySelector('.score');
let highScoreBox = document.querySelector('.high-score');
let direction = {x: 0, y: 0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let food = {x: 2, y: 2};
let lastPaintTime = 0;
let snakeArray = [
    {x: 11, y: 11}
]
let score = 0;
let gameOver = false;


let highScore = localStorage.getItem("highScore");
if (highScore === null){
    highScoreValue = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue));
} else{
    highScoreValue = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScore;
} 


//Game Functions
function main(currentTime){
    window.requestAnimationFrame(main);
    if ((currentTime - lastPaintTime) / 1000 < 1/speed ){
        return;
    }
    lastPaintTime = currentTime;
    gameEngine();
}

function collision(snakeArray){
    //bump into the wall
    if (snakeArray[0].x >= 18 || snakeArray[0].x <= 0 || snakeArray[0].y >= 18 || snakeArray[0].y <= 0){
        gameOverSound.play();
        alert("Game Over! You hit the wall. Press enter to play again");
        return true;
    }
    //bump into yourself
    for (let i = 1; i < snakeArray.length; i++){
        if (snakeArray[i].x === snakeArray[0].x && snakeArray[i].y === snakeArray[0].y){
            gameOverSound.play();
            alert("Game Over! You hit yourself. Press enter to play again");
            return true;
        }
    }
    return false;
}

function gameEngine(){
    //Part 1: Updating the snake array
    if (collision(snakeArray)){
        direction = {x: 0, y: 0};
        snakeArray = [{x: 11, y: 11}];
        musicSound.play();
        gameOver = true;
        score = 0;
        speed = 5;
    }

    //If you have eaten the food, increment the score and regenerate the food
    if (snakeArray[0].x === food.x && snakeArray[0].y === food.y){
        foodSound.play();
        snakeArray.unshift({x: snakeArray[0].x + direction.x, y: snakeArray[0].y + direction.y})
        speed += 0.5;
        food = {x: Math.floor(Math.random() * 17) + 1, y: Math.floor(Math.random() * 17) + 1}
        score += 1;
        let isFoodOnSnake = true;
        do {
            isFoodOnSnake = false;
            food ={
                x: Math.floor(Math.random() * 17) + 1,
                y: Math.floor(Math.random() * 17) + 1
            }
            for (let segment of snakeArray) {
                if (segment.x === food.x && segment.y === food.y) {
                    isFoodOnSnake = true;
                    break;
                }
            }
        } while (isFoodOnSnake); 
        scoreBox.innerHTML = "Score: " + score;
        if (score > highScoreValue){
            highScoreValue = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreValue));
            highScoreBox.innerHTML = "High Score: " + highScoreValue;
        }
    }

    //Moving the snake
    for (let i = snakeArray.length - 2; i >= 0; i--){
        snakeArray[i+1] = {...snakeArray[i]}
    }
    snakeArray[0].x += direction.x;
    snakeArray[0].y += direction.y;

    //Part 2: Display the snake & food
    board.innerHTML = "";
    snakeArray.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0){
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })

    //Part 3: Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}
//Main Logic
window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    if (gameOver){
        gameOver = false;
        snakeArray = [{x: 11, y: 11}];
        musicSound.pause();
        musicSound.currentTime = 0;
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }
    direction = {x:0, y:1}
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            direction = {x:0, y:-1}
            break;
        case "ArrowDown":
            direction = {x:0, y:1}
            break;
        case "ArrowLeft":
            direction = {x:-1, y:0}
            break;
        case "ArrowRight":
            direction = {x:1, y:0}
            break;
        default:
            break;
    }
})
window.requestAnimationFrame(main);