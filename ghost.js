class Ghost {
  constructor(x, y, width, height, color, direction, speed, range) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.direction = direction;
    this.nextDirection = this.direction;
    this.speed = speed;
    this.randomTargetIndex = 1;
    this.range = range;
    this.target = randomTargets[this.randomTargetIndex];

    setInterval(() => {
      this.changeRandomIndex();
    }, 10000);
  }

  changeRandomIndex() {
    this.randomTargetIndex += 1;
    this.randomTargetIndex = this.randomTargetIndex % randomTargets.length;
  }

  isInRangeWithPacman() {
    let xDifference = Math.abs(pacman.getMapX() - this.getMapX());
    let yDifference = Math.abs(pacman.getMapY() - this.getMapY());

    if (
      Math.sqrt(xDifference * xDifference + yDifference * yDifference) <=
      this.range
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
    this.changeDirectionIfPossible();

    this.moveForwards();

    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
  }

  changeDirectionIfPossible() {
    // if (this.direction == this.nextDirection) return;

    let tempDirection = this.direction;

    this.direction = this.calculateNextDirection(
      map,
      parseInt(this.target.x / gameCubeSize),
      parseInt(this.target.y / gameCubeSize),
    );

    if (
      this.getMapY() != this.getMapYRightSide() &&
      (this.direction == DIRECTION_RIGHT || this.direction == DIRECTION_LEFT)
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

  calculateNextDirection(map, destX, destY) {
    let mp = [];
    for (var i = 0; i < map.length; i++) {
      mp[i] = map[i].slice();
    }

    let queue = [{ x: this.getMapX(), y: this.getMapY(), moves: [] }];

    while (queue.length > 0) {
      let poped = queue.shift();
      if (poped.x == destX && poped.y == destY) {
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;
        let neibhourLists = this.addNeighbours(mp, poped);

        for (var i = 0; i < neibhourLists.length; i++) {
          queue.push(neibhourLists[i]);
        }
      }
    }

    return DIRECTION_UP;
  }

  addNeighbours(mp, poped) {
    let queue = [];

    let numberRows = mp.length;
    let numberColumns = mp[0].length;

    if (poped.x - 1 >= 0 && mp[poped.y][poped.x - 1] !== 1) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);

      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }

    if (poped.x + 1 >= 0 && mp[poped.y][poped.x + 1] !== 1) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGHT);

      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }

    if (poped.y - 1 >= 0 && mp[poped.y - 1][poped.x] !== 1) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);

      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }

    if (poped.y + 1 >= 0 && mp[poped.y + 1][poped.x] !== 1) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);

      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }

    return queue;
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;

      case DIRECTION_LEFT:
        this.x += this.speed;
        break;

      case DIRECTION_UP:
        this.y += this.speed;
        break;

      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;

      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;

      case DIRECTION_UP:
        this.y -= this.speed;
        break;

      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  draw() {
    createRect(this.x, this.y, this.width, this.height, this.color);
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

  getMapX() {
    return parseInt(this.x / gameCubeSize);
  }
  getMapY() {
    return parseInt(this.y / gameCubeSize);
  }

  getMapXRightSide() {
    return parseInt((this.x + 0.9999 * gameCubeSize) / gameCubeSize);
  }

  getMapYRightSide() {
    return parseInt((this.y + 0.9999 * gameCubeSize) / gameCubeSize);
  }
}
