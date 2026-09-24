let gameCanvas = document.getElementById("game-canvas"),
  gameContext = gameCanvas.getContext("2d"),
  gameMainPic = document.getElementById('main-pic'),
  gameCubeSize = 20,
  wallColor = "#342DCA",
  wallSpaceWidth = gameCubeSize / 1.4,
  wallOffset = (gameCubeSize - wallSpaceWidth) / 2,
  wallInnerColor = "black",
  DIRECTION_UP = 3,
  DIRECTION_LEFT = 2,
  DIRECTION_RIGHT = 4,
  DIRECTION_BOTTOM = 1,
  fps = 30,
  pacman,
  scoreCount = 0,
  score = 0;

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

//x axis columns
//y axis rows

let randomTargets = [
  { x: 1 * gameCubeSize, y: 1 * gameCubeSize },
  { x: 1 * gameCubeSize, y: (map.length - 2) * gameCubeSize },
  { x: (map[0].length - 2) * gameCubeSize, y: gameCubeSize },
  { x: (map[0].length - 2) * gameCubeSize, y: (map.length - 2) * gameCubeSize },
];


let ghostsColors = ["red", "orange", "grey", "pink"];
let ghosts = [];

for (var i = 0; i < map.length; i++) {
  for (var j = 0; j < map[0].length; j++) {
    if (map[i][j] == 2) {
      scoreCount++;
    }
  }
}

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

  drawScore();
  drawFoods();
  pacman.draw();
  drawGhosts();
};

const drawGhosts = () => {
  ghosts.forEach((ghost) => {
    ghost.draw();
  });
};

const drawScore = () => {
  gameContext.font = "20px Emulogic";
  gameContext.fillStyle = "white";
  gameContext.fillText("Score: " + score, 0, gameCubeSize * (map.length + 1));
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
  checkWonGame();
}

update = () => {
  createRect(0, 0, gameCanvas.width, gameCanvas.height, "black");
  pacman.moveProcess();
  pacman.eat();
  for(var i = 0; i < ghosts.length; i++){
    ghosts[i].moveProcess()
  }
  if(pacman.checkGhostHit()){
  //  console.log('hit')
  }
};

const checkWonGame = () => {
  if (score >= scoreCount) {
    drawWonGame();
    createPacMan();
  }
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
let createGhosts = () => {
  for (var i = 0; i < ghostsColors.length; i++) {
    let ghost = new Ghost(
      9 * gameCubeSize + (i % 2 ? 0 : 1) * gameCubeSize,
      10 * gameCubeSize + (i % 2 ? 0 : 1) * gameCubeSize,
      gameCubeSize,
      gameCubeSize,
      pacman.speed / 2,
      DIRECTION_UP,
      ghostsColors[i],
      6 + i
    );

    ghosts.push(ghost);
  }
};

const drawWonGame = () => {
  gameContext.font = "20px Emulogic";
  gameContext.fillStyle = "white";
  gameContext.fillText(
    "You Won!!",
    gameCubeSize * 5,
    gameCubeSize * (map.length + 1),
  );
};

createPacMan();
createGhosts();
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
