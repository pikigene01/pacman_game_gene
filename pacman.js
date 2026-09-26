class PacMan {
  constructor(x, y, width, height, direction, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.nextDirection = this.direction;
    this.color = color;
    this.speed = speed;
    this.frames = 7;
    this.currentFrame = 1;

    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frames ? 1 : (this.currentFrame += 1);
  }

  moveProcess() {
    this.changeDirectionIfPossible();

    this.moveForwards();

    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
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

  onGhostCollision(ghosts) {
    for (var i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }
    return false;
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

  draw() {
    gameContext.save();
    gameContext.translate(this.x + gameCubeSize / 2, this.y + gameCubeSize / 2);
    gameContext.rotate((this.direction * 90 * Math.PI) / 180);
    gameContext.translate(
      -this.x - gameCubeSize / 2,
      -this.y - gameCubeSize / 2,
    );

    gameContext.drawImage(
      pacManFrames,
      (this.currentFrame - 1) * gameCubeSize,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      gameCubeSize,
      gameCubeSize,
    );

    gameContext.restore();
  }

  eat() {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2 && j == this.getMapX() && this.getMapY() == i) {
          //then this is food
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
