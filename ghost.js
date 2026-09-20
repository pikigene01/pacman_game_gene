class Ghost {
  constructor(x, y, width, height, speed, direction, color, range) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.framecount = 7;
    this.direction = direction;
    this.nextDirection = this.direction;
    this.color = color;
    this.range = range;
    this.randomTargetIndex = parseInt(Math.random() * ghosts.length);
    this.target = randomTargets[this.randomTargetIndex];
    setInterval(() => {
      this.changeRandomIndex();
    }, 10000);
  }

  changeRandomIndex() {
    this.randomTargetIndex += 1;

    this.randomTargetIndex = this.randomTargetIndex % 4;
  }
  isInRangeWithPacman() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());

    if (
      Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
    ) {
      return true;
    }

    return false;
  }

  moveProcess() {
    if (this.isInRangeWithPacman()) {
      this.target = pacman;
    } else {
      this.target = randomTargets[this.randomTargetIndex];
    }

    let tempDirection = this.direction;

    this.changeDirectionIfPossible();
    this.moveForwards();

    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    }

    this.draw();
  }

  changeDirectionIfPossible() {
    let tempDirection = this.direction;

    this.direction = this.calculateNewDirection(
      map,
      parseInt(this.target.x / gameCubeSize),
      parseInt(this.target.y / gameCubeSize),
    );

    if (typeof this.direction == "undefined") {
      this.direction = tempDirection;
      return;
    }

    if (
      this.getMapY() != this.getMapYRightSide() &&
      (this.direction == DIRECTION_LEFT || this.direction == DIRECTION_RIGHT)
    ) {
      this.direction = DIRECTION_UP;
    }
    if (
      this.getMapX() != this.getMapXRightSide() &&
      this.direction == DIRECTION_UP
    ) {
      this.direction = DIRECTION_LEFT;
    }
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  draw() {
    // gameContext.save();

    createRect(this.x, this.y, gameCubeSize, gameCubeSize, this.color);

    // gameContext.restore();
  }

  calculateNewDirection(map, destX, destY) {
    let mp = [];
    for (var i = 0; i < map.length; i++) {
      mp[i] = map[i].slice();
    }

    let queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        rightX: this.getMapXRightSide(),
        rightY: this.getMapYRightSide(),
        moves: [],
      },
    ];
    while (queue.length > 0) {
      let poped = queue.shift();

      if (poped.x == destX && poped.y == destY) {
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;

        let neighbourLists = this.addNeighbours(mp, poped);
        // console.log(neighbourLists)

        for (var i = 0; i < neighbourLists.length; i++) {
          queue.push(neighbourLists[i]);
        }
      }
    }
    return DIRECTION_BOTTOM; //default move
  }

  addNeighbours(mp, poped) {
    let queue = [];
    let numberRows = mp.length;
    let numberColumns = mp[0].length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numberRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }

    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numberRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }

    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numberColumns &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }

    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numberColumns &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }

    return queue;
  }
  eat() {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 3;
          score++;
        }
      }
    }
  }

  checkCollisions() {
    if (
      map[this.getMapY()][this.getMapX()] == 1 ||
      map[this.getMapYRightSide()][this.getMapX()] == 1 ||
      map[this.getMapY()][this.getMapXRightSide()] == 1 ||
      map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
    ) {
      return true;
    }
    return false;
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_UP:
        this.y += this.speed;
        break;

      case DIRECTION_LEFT:
        this.x += this.speed;
        break;

      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;

      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_UP:
        this.y -= this.speed;
        break;

      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;

      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;

      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  getMapX() {
    return parseInt(this.x / gameCubeSize);
  }

  getMapY() {
    return parseInt(this.y / gameCubeSize);
  }

  getMapXRightSide() {
    return parseInt((this.x * 0.9999 + gameCubeSize) / gameCubeSize);
  }
  getMapYRightSide() {
    return parseInt((this.y * 0.9999 + gameCubeSize) / gameCubeSize);
  }
}
