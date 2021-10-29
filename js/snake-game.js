let playng = false;
let score = 0;

let audioPlay = new Audio('/sounds/startgame.wav');
audioPlay.volume = 0.1;
function startPlay() {
    playng = !playng;
    
    if (playng) {
        document.getElementById("game-btn-content").style.display = 'none';        
        audioPlay.play();
    }
}

document.addEventListener("DOMContentLoaded", function () {


    let x, y, w, h, snakePosition, direction, newSnake, newComida, foodX, foodY;
    let audioFruit = new Audio('/sounds/fruit.wav');
    audioFruit.volume = 0.1;
    let audioGameover = new Audio('/sounds/gameover.wav');
    audioGameover.volume = 0.1;

    snakePosition = [
        { x: 20, y: 20 },
        { x: 40, y: 20 },
    ]

    foodX = Math.floor(Math.random() * 40) * 20;
    foodY = Math.floor(Math.random() * 40) * 20;
    w = 800, h = 800;
    x = 20, y = 20;
    direction = 'RIGHT';

    // carregar o canvas
    let canvas = document.getElementById('canvas');
    if (!canvas) {
        alert("Canvas não identificado!")
    }
    let ctx = canvas.getContext('2d');

    setInterval(() => {
        ctx.clearRect(0, 0, 800, 800)
        if (playng) {
            initGame()


        }
    }, 100)



    // criar o objeto snake
    class Snake {
        constructor(snakePosition, x, y, direction, w, h, foodX, foodY) {
            this.snakePosition = snakePosition;
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.w = w;
            this.h = h;
            this.foodX = foodX;
            this.foodY = foodY;
        }

        draw() {
            snakePosition.map((pos) => {
                ctx.fillStyle = "white";
                ctx.fillRect(pos.x, pos.y, x, y)
            })
        }

        walk() {
            //Criar a nova posição
            let newPos = {

            }

            if (direction === 'RIGHT') {
                newPos.x = snakePosition[snakePosition.length - 1].x + 20;
                newPos.y = snakePosition[snakePosition.length - 1].y;
            } else if (direction === 'LEFT') {
                newPos.x = snakePosition[snakePosition.length - 1].x - 20;
                newPos.y = snakePosition[snakePosition.length - 1].y;
            } else if (direction === 'UP') {
                newPos.x = snakePosition[snakePosition.length - 1].x;
                newPos.y = snakePosition[snakePosition.length - 1].y - 20;
            } else if (direction === 'DOWN') {
                newPos.x = snakePosition[snakePosition.length - 1].x;
                newPos.y = snakePosition[snakePosition.length - 1].y + 20;
            }

            snakePosition.shift();
            snakePosition.push(newPos);

        }

        checkHit() {
            //comida
            if (snakePosition[snakePosition.length - 1].x === foodX && snakePosition[snakePosition.length - 1].y === foodY) {

                foodX = Math.floor(Math.random() * 40) * 20;
                foodY = Math.floor(Math.random() * 40) * 20;
                snakePosition.unshift({
                    x: snakePosition[0].x,
                    y: snakePosition[0].y
                })
                score++;
                audioFruit.play();
            }

            //parede
            if (snakePosition[snakePosition.length - 1].x >= w || snakePosition[snakePosition.length - 1].x < 0
                || snakePosition[snakePosition.length - 1].y >= h || snakePosition[snakePosition.length - 1].y < 0) {

                ctx.clearRect(0, 0, 800, 800)
                foodX = Math.floor(Math.random() * 40) * 20;
                foodY = Math.floor(Math.random() * 40) * 20;
                snakePosition = [
                    { x: 20, y: 20 },
                    { x: 40, y: 20 },
                ]
                direction = 'RIGHT';
                playng = false;
                document.getElementById("game-btn-content").style.display = 'grid';
                document.getElementById("game-over-text").innerHTML = "GAME OVER! <br><br> SCORE: " + score;
                score = 0;
                audioGameover.play();
            }

            let snakePositionCopy = snakePosition.concat()
            let snakePositionNew = snakePositionCopy.pop();

            snakePositionCopy.map((pos) => {
                if (snakePositionNew.x === pos.x && snakePositionNew.y === pos.y) {
                    console.log('hit body')
                }
            })
        }

        init() {
            this.checkHit();
            if (!playng) return;

            this.draw();
            this.walk();
        }

    }

    // criar o objeto comida
    class Comida {
        constructor(foodX, foodY) {
            this.foodX = foodX;
            this.foodY = foodY;
        }

        draw() {
            if (!playng) return;
            ctx.fillStyle = "#C27676";
            ctx.fillRect(foodX, foodY, 20, 20);
            // ctx.drawImage(document.getElementById("fruit"), foodX, foodY, 20,20);
        }
    }

    // modificar direções a partir de ações do teclado
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if (keyName === 'ArrowDown' && direction !== 'UP') {
            direction = 'DOWN';
        } else if (keyName === 'ArrowUp' && direction !== 'DOWN') {
            direction = 'UP';
        } else if (keyName === 'ArrowLeft' && direction !== 'RIGHT') {
            direction = 'LEFT';
        } else if (keyName === 'ArrowRight' && direction !== 'LEFT') {
            direction = 'RIGHT';
        }
    });

    newSnake = new Snake(snakePosition, x, y, direction, w, h, foodX, foodY);
    newComida = new Comida();


    // funcao para atualizar requestKeyFrame()
    function initGame() {
        newSnake.init();
        newComida.draw();
    }


});