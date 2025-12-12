class Player {
  constructor(x, y, img, bigSize = false) {
    this.x = x;
    this.y = y;
    this.speed = 6;
    this.img = img;
    
    if (bigSize) {
      this.width = 56;
      this.height = 64;
    } else {
      this.width = 28;
      this.height = 32;
    }
  }

  update(maze) {
    let newX = this.x;
    let newY = this.y;

    if (keyIsDown(LEFT_ARROW))  newX -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) newX += this.speed;
    if (keyIsDown(UP_ARROW))    newY -= this.speed;
    if (keyIsDown(DOWN_ARROW))  newY += this.speed;

    if (!maze || maze.isValidPosition(newX, newY, this.width, this.height)) {
      this.x = constrain(newX, 0, width);
      this.y = constrain(newY, 0, height);
    }
  }

  display() {
    imageMode(CENTER);
    if (this.img && this.img.width) {
      noTint();
      image(this.img, this.x, this.y, this.width, this.height);
    }
  }
}