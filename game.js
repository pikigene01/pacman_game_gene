const gameCanvas = document.getElementById("game-canvas"),
  gameContext = gameCanvas.getContext("2d"),
  pacManFrames = document.getElementById("main-pic");

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

let fps = 30,
  gameCubeSize = 20,
  wallColor = "#342DCA",
  wallInnerWidth = gameCubeSize / 1.3,
  wallOffset = (gameCubeSize - wallInnerWidth) / 2,
  wallInnerColor = "black",
  pacman,
  score = 0,
  ghosts = [],
  lives = 3;

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

let ghostsColors = ["red", "white", "green", "purple"];

let DIRECTION_RIGHT = 4,
  DIRECTION_UP = 3,
  DIRECTION_LEFT = 2,
  DIRECTION_BOTTOM = 1;

function createRect(x, y, width, height, color) {
  gameContext.fillStyle = color;
  gameContext.fillRect(x, y, width, height);
}

let gameInterval = setInterval(gameLoop, 1000 / fps);

function drawFoods() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        //then this is food
        // createRect(
        //   j * gameCubeSize + gameCubeSize / 3,
        //   i * gameCubeSize + gameCubeSize / 3,
        //   gameCubeSize / 3,
        //   gameCubeSize / 3,
        //   "yellow",
        // );

        gameContext.drawImage(
          pacManFrames,
          5 * gameCubeSize,
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

let drawWalls = () => {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        //then this is wall
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
};

function drawScore() {
  gameContext.fillStyle = "white";
  gameContext.font = "20px Emulogic";
  gameContext.fillText("Score: " + score, 0, (map.length + 1) * gameCubeSize);
}
function drawLives() {
  gameContext.fillStyle = "white";
  gameContext.font = "20px Emulogic";

  gameContext.fillText("Lives: ", 210, (map.length + 1) * gameCubeSize);

  for (var i = 0; i < lives; i++) {
    gameContext.drawImage(
      pacManFrames,
      2 * gameCubeSize,
      0,
      gameCubeSize,
      gameCubeSize,
      260 + i * gameCubeSize,
      (map.length + 0.2) * gameCubeSize,
      gameCubeSize,
      gameCubeSize,
    );
  }
}

function createNewPacMan() {
  pacman = new PacMan(
    gameCubeSize,
    gameCubeSize,
    gameCubeSize,
    gameCubeSize,
    DIRECTION_RIGHT,
    gameCubeSize / 5,
    "green",
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
        DIRECTION_UP,
        pacman.speed / 2,
        ghostsColors[i],
        i + 6,
      ),
    );
  }
}

function drawGhosts() {
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
}
function moveGhosts() {
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
}

function draw() {
  createRect(0, 0, gameCanvas.width, gameCanvas.height, wallInnerColor);
  drawWalls();
  drawFoods();
  drawScore();
  drawLives();
  pacman.draw();
  drawGhosts();
}

function update() {
  draw();
  pacman.moveProcess();
  pacman.eat();
  moveGhosts();
  if (pacman.onGhostCollision(ghosts)) {
    createNewPacMan();
    createGhosts();
    lives--;
  }
}

function gameLoop() {
  update();
}

createNewPacMan();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;

  setTimeout(() => {
    if (k == 40) {
      pacman.nextDirection = DIRECTION_BOTTOM;
    } else if (k == 39) {
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 38) {
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 37) {
      pacman.nextDirection = DIRECTION_LEFT;
    }
  }, 1);
});
