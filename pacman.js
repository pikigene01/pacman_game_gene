class PacMan {
  constructor(x, y, width, height, speed, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.framecount = 7;
    this.direction = direction;
    this.nextDirection = this.direction;
  }

  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
  }

  draw() {
    // gameContext.save();

    createRect(this.x, this.y, gameCubeSize, gameCubeSize, "red");

    // gameContext.drawImage('ffd', )
    // gameContext.translate(this.x );
    // gameContext.restore();
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

  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;
    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  checkGhostHit() {
    for (var i = 0; i < ghosts.length; i++) {
      if (
        this.getMapX() == ghosts[i].getMapX() &&
        this.getMapY() == ghosts[i].getMapY()
      ) {
        return true;
      }
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
