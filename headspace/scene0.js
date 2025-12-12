class Scene0 {
  constructor() {
    this.player = null;
    this.doorX = 250;
    this.doorWidth = 100;
    this.doorHeight = 60;

    this.textAlpha = 0;
    this.textState = "fadeIn";
    this.textTimer = 0;

    this.showMove = false;
    this.moveAlpha = 0;
    this.reachedDoor = false;

    this.awaitingClick = true;
    this.musicStarted = false;
  }

  setup() {
  }

  spawnPlayer() {
    if (this.player) return;
    this.player = new Player(width / 2, height - 50, playerImgs[1], true);
    this.showMove = false;
  }

  display() {
    background(0);

    if (this.awaitingClick) return;

    if (!this.player) {
      if (this.textState === "fadeIn") {
        this.textAlpha = min(this.textAlpha + 3, 255);
        if (this.textAlpha === 255) this.textState = "hold";
      } else if (this.textState === "hold") {
        this.textTimer++;
        if (this.textTimer > 120) this.textState = "fadeOut";
      } else if (this.textState === "fadeOut") {
        this.textAlpha = max(this.textAlpha - 2, 0);
        if (this.textAlpha === 0) this.showMove = true;
      }

      fill(255, this.textAlpha);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("no one is coming to help.\nyou have to make the first move.", width / 2, height / 2);

      if (this.showMove) {
        this.moveAlpha = min(this.moveAlpha + 3, 255);
        fill(200, this.moveAlpha);
        textAlign(CENTER, BOTTOM);
        textSize(18);
        text("press any arrow key to MOVE", width / 2, height - 40);
      }
    }

    if (
      !this.player &&
      (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ||
       keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW))
    ) {
      this.spawnPlayer();
    }

    if (this.player) {
      this.drawDoor();
      this.drawSpotlight(this.player.x, this.player.y);

      this.player.update();
      this.player.display();

      if (!this.reachedDoor && this.checkDoorCollision()) {
        this.reachedDoor = true;
        setTimeout(() => sceneManager.nextScene(), 3000);
      }
    }
  }

  checkDoorCollision() {
    return (
      this.player.x > this.doorX + 30 &&
      this.player.x < this.doorX + this.doorWidth - 30 &&
      this.player.y - this.player.height / 2 < this.doorHeight
    );
  }

  keyPressed() {
    if (this.awaitingClick) return; // ignore until click
    if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) {
      this.spawnPlayer();
    }
  }

  mousePressed() {
    if (this.awaitingClick) {
      let ctx = getAudioContext();
      if (ctx.state !== "running") ctx.resume();

      if (!this.musicStarted) {
        playMusic(music.intro);
        this.musicStarted = true;
      }

      this.awaitingClick = false;
      return;
    }

    if (!this.player) this.spawnPlayer();
  }

  drawDoor() {
    push();
    translate(this.doorX, 0);
    stroke(255);
    strokeWeight(2);
    fill("#2b1400");
    beginShape();
    vertex(0, 0);
    vertex(this.doorWidth, 0);
    vertex(this.doorWidth - 30, this.doorHeight);
    vertex(30, this.doorHeight);
    endShape(CLOSE);
    noStroke();
    fill("brown");
    circle(this.doorWidth - 30, this.doorHeight / 2, 8);
    pop();
  }

  drawSpotlight(x, y) {
    noStroke();
    for (let r = 90; r > 0; r -= 3) {
      const bright = map(r, 90, 0, 0, 255);
      const a = map(r, 90, 0, 0, 100);
      fill(bright, a);
      circle(x, y, r * 2);
    }
    fill(255, 220);
    circle(x, y, 8);
  }

  cleanup() {
    this.player = null;

    this.textAlpha = 0;
    this.textState = "fadeIn";
    this.textTimer = 0;

    this.showMove = false;
    this.moveAlpha = 0;

    this.reachedDoor = false;

    this.awaitingClick = true;
    this.musicStarted = false;
  }
}
