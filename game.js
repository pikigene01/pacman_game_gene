let gameCanvas = document.getElementById("game-canvas"),
  gameContext = gameCanvas.getContext("2d"),
  gameCubeSize = 20,
  wallColor = "#342DCA",
  wallSpaceWidth = gameCubeSize / 1.4,
  wallOffset = (gameCubeSize - wallSpaceWidth) / 2,
  wallInnerColor = "black",
  DIRECTION_UP = 4,
  DIRECTION_LEFT = 3,
  DIRECTION_RIGHT = 2,
  DIRECTION_BOTTOM = 1,
  fps = 30,
  pacman;

let gameInterval = setInterval(gameLoop, 1000 / fps);

let createRect = (x, y, width, height, color) => {
  gameContext.fillStyle = color;
  gameContext.fillRect(x, y, width, height);
};

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

const draw = () => {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        //this is a wall
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
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor,
        );
      }

      if (j < map[0].length - 1 && map[i][j + 1] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor,
        );
      }

      if (i > 0 && map[i - 1][j] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor,
        );
      }

      if (i < map.length - 1 && map[i + 1][j] == 1) {
        createRect(
          j * gameCubeSize + wallOffset,
          i * gameCubeSize + wallOffset,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor,
        );
      }
    }
  }

  drawFoods();
  pacman.draw();
};

let drawFoods = () => {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * gameCubeSize + gameCubeSize / 3,
          i * gameCubeSize + gameCubeSize / 3,
          gameCubeSize / 3,
          gameCubeSize / 3,
          "yellow",
        );
      }
    }
  }
};

function gameLoop() {
  update();
  draw();
}

update = () => {
  createRect(0, 0, gameCanvas.width, gameCanvas.height, "black");
  pacman.moveProcess();
  pacman.eat();
};

let createPacMan = () => {
  pacman = new PacMan(
    gameCubeSize,
    gameCubeSize,
    gameCubeSize,
    gameCubeSize,
    gameCubeSize / 5,
    DIRECTION_RIGHT,
  );
};

createPacMan();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;

  setTimeout(() => {
    if (k == 37 || k == 65) {
      //left
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      //up
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      //right 
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      //bottom
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
