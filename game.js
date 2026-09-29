let gameCanvas = document.getElementById("game-canvas"),
  gameContext = gameCanvas.getContext("2d"),
  pacmanFrames = document.getElementById("pacman-frames");

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//i == number rows or y axis of the game
// j == number colums or x asis of the game

let fps = 30,
  wallColor = "#342DCA",
  gameCubeSize = 20,
  wallInnerWidth = gameCubeSize / 1.4,
  wallOffset = (gameCubeSize - wallInnerWidth) / 2,
  wallInnerColor = "black",
  pacman,
  score = 0,
  lives = 3,
  pauseGame = false;

let DIRECTION_RIGHT = 4,
  DIRECTION_UP = 3,
  DIRECTION_LEFT = 2,
  DIRECTION_BOTTOM = 1;

let ghostsColors = ["grey", "white", "purple", "red"];

let randomTargets = [
  {
    x: 1 * gameCubeSize,
    y: 1 * gameCubeSize,
  },
  {
    x: 1 * gameCubeSize,
    y: (map.length - 2) * gameCubeSize,
  },
  {
    x: (map[0].length - 2) * gameCubeSize,
    y: gameCubeSize,
  },
  {
    x: (map[0].length - 2) * gameCubeSize,
    y: (map.length - 2) * gameCubeSize,
  },
];
let ghosts = [];

let gameInterval = setInterval(gameLoop, 1000 / fps);

function createRect(x, y, width, height, color) {
  gameContext.fillStyle = color;
  gameContext.fillRect(x, y, width, height);
}

function drawWalls() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        //then this is a wall
        createRect(
          j * gameCubeSize,
          i * gameCubeSize,
          gameCubeSize,
          gameCubeSize,
          wallColor,
        );
      }

      if (j > 0 && map[i][j - 1] == 1) {
        createRect(
          j * gameCubeSize,
          i * gameCubeSize + wallOffset,
          wallInnerWidth + wallOffset,
          wallInnerWidth,
          wallInnerColor,
        );
      }

      if (j < map[0].length - 1 && map[i][j + 1] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize + wallOffset,
          wallInnerWidth + wallOffset,
          wallInnerWidth,
          wallInnerColor,
        );
      }

      if (i > 0 && map[i - 1][j] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize,
          wallInnerWidth,
          wallInnerWidth + wallOffset,
          wallInnerColor,
        );
      }

      if (i < map.length - 1 && map[i + 1][j] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize + wallOffset,
          wallInnerWidth,
          wallInnerWidth + wallOffset,
          wallInnerColor,
        );
      }
    }
  }
}

function drawFoods() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        //then this is a food
        gameContext.drawImage(
          pacmanFrames,
          4 * gameCubeSize,
          0,
          gameCubeSize,
          gameCubeSize,
          j * gameCubeSize + gameCubeSize / 3,
          i * gameCubeSize + gameCubeSize / 3,
          gameCubeSize / 3,
          gameCubeSize / 3,
        );
      }
    }
  }
}

function drawScore() {
  gameContext.fillStyle = "white";
  gameContext.font = "30px Emulogic";

  gameContext.fillText("Score: " + score, 0, (map.length + 1.3) * gameCubeSize);
}

function createNewPacman() {
  pacman = new PacMan(
    gameCubeSize,
    gameCubeSize,
    gameCubeSize,
    gameCanvas,
    "yellow",
    DIRECTION_RIGHT,
    gameCubeSize / 5,
  );
}

function createGhosts() {
  ghosts = [];
  for (var i = 0; i < ghostsColors.length; i++) {
    ghosts.push(
      new Ghost(
        9 * gameCubeSize + (i % 2 == 0 ? 0 : 1) * gameCubeSize,
        10 * gameCubeSize + (i % 2 == 0 ? 0 : 1) * gameCubeSize,
        gameCubeSize,
        gameCubeSize,
        ghostsColors[i],
        DIRECTION_UP,
        pacman.speed / 2,
        i + 6,
      ),
    );
  }
}

function drawLives() {
  gameContext.fillStyle = "white";
  gameContext.font = "30px Emulogic";

  gameContext.fillText("Lives: ", 200, (map.length + 1.3) * gameCubeSize);

  for (var i = 0; i < lives; i++) {
    gameContext.drawImage(
      pacmanFrames,
      4 * gameCubeSize,
      0,
      gameCubeSize,
      gameCubeSize,
      map[0].length + 270 + i * gameCubeSize,
      (map.length + 0.4) * gameCubeSize,
      gameCubeSize,
      gameCubeSize,
    );
  }
}

function drawGhosts() {
  ghosts.forEach((ghost) => {
    ghost.draw();
  });
}
function moveGhosts() {
  ghosts.forEach((ghost) => {
    ghost.moveProcess();
  });
}

function draw() {
  createRect(0, 0, gameCanvas.width, gameCanvas.height, wallInnerColor);
  drawWalls();
  drawFoods();
  drawScore();
  pacman.draw();
  drawGhosts();
  drawLives();
}

function update() {
  draw();
  pacman.moveProcess();
  pacman.eat();
  moveGhosts();
  if (pacman.checkGhostCollision(ghosts)) {
    createNewPacman();
    createGhosts();
    lives--;
  }
}

function gameLoop() {
  update();
}

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;

  setTimeout(() => {
    if (k == 40) {
      pacman.nextDirection = DIRECTION_BOTTOM;

      //direction bottom
    } else if (k == 39) {
      // direction right
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 38) {
      //direction up

      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 37) {
      // direction left

      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 32) {
      //pause the game
      pauseGame = !pauseGame;

      if (pauseGame) {
        clearInterval(gameInterval);
      } else {
        gameInterval = setInterval(gameLoop, 1000 / fps);
      }
    }
  }, 1);
});
