class Scene2 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    playMusic(music.scene2);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#9a0000ff");
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 2", width/2, height/2);
    
    if (this.titleAlpha >= 255) {
      this.promptAlpha = min(this.promptAlpha + 3, 255);
      fill(255, this.promptAlpha);
      textAlign(CENTER, BOTTOM);
      textSize(18);
      text("press SPACE to start", width / 2, height - 40);
    }
  }
  
  cleanup() {}
}

class Scene2A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
     [1,1,1,1,0,0,0,1,1,1,0,1],
        [0,1,0,1,0,1,0,0,1,0,0,1],
        [0,0,1,1,0,1,1,0,1,0,1,1],
        [1,0,1,0,0,1,0,0,1,0,0,1],
        [0,0,1,0,1,1,0,1,1,1,0,1],
        [0,1,1,0,0,1,0,0,1,0,0,1],
        [0,0,1,1,0,1,1,0,1,0,1,1],
        [1,0,1,0,0,1,0,0,1,0,0,1],
        [0,0,1,0,1,1,0,1,1,1,0,1],
        [0,1,1,0,0,1,0,1,1,0,0,1],
        [0,0,0,1,0,1,0,0,1,0,1,1],
       [1,1,0,0,0,1,1,0,0,0,1,1]
    ];

    const dotCells = [
      { col: 0, row: 10 },
      { col: 5, row: 0 },
      { col: 7, row: 7 }
    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 0, row: 1 },
      goalCell: { col: 10, row: 0 },
      dotCells: dotCells,
      wallColor: { r: 190, g: 50, b: 50, a: 255 },
      glowColor: { r: 255, g: 99, b: 99, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[2]);
    this.completed = false;
  }

  display() {
    if (!this.player || !this.maze) this.setup();
    background(8, 12, 22);
    this.maze.display();
    this.player.update(this.maze);
    this.player.display();
    this.maze.checkDotCollection(this.player.x, this.player.y);

    if (!this.completed && this.maze.checkWin(this.player.x, this.player.y)) {
      this.completed = true;
      setTimeout(() => sceneManager.nextScene(), 3000);
    }
  }

  cleanup() {
    this.player = null;
    this.maze = null;
  }
}

class Scene2B {
  constructor() {
    this.explodeXY = [];
    this.exploded = [];
    this.particles = [];
    this.finished = false;
    this.finishTimerStarted = false;
    this.textAlpha = 0;
  }

  setup() {
    // playMusic(music.scene2B);
    imageMode(CENTER);
    this.explodeXY = [
      { x: 100, y: 200, w: 100, h: 100 },
      { x: 250, y: 120, w: 100, h: 100 },
      { x: 400, y: 250, w: 100, h: 100 },
      { x: 470, y: 150, w: 100, h: 100 },
      { x: 450, y: 340, w: 100, h: 100 },
      { x: 250, y: 330, w: 100, h: 100 }
    ];
    this.exploded = Array(explodeImgs.length).fill(false);
    this.particles = [];
    this.finished = false;
    this.finishTimerStarted = false;
    this.textAlpha = 0;
  }

  display() {
    background(0);

    for (let i = 0; i < explodeImgs.length; i++) {
      if (!this.exploded[i]) {
        this.drawPixelated(explodeImgs[i], this.explodeXY[i]);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].show();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }

    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("click object to UNLEASH", width / 2, height -40);

    if (!this.finished && this.allExploded() && this.particles.length === 0) {
      this.finished = true;
    }

    if (this.finished && !this.finishTimerStarted) {
      this.finishTimerStarted = true;
      setTimeout(() => sceneManager.nextScene(), 5000);
    }
  }

  mousePressed() {
    for (let i = 0; i < explodeImgs.length; i++) {
      if (!this.exploded[i] && this.overImage(mouseX, mouseY, this.explodeXY[i])) {
        this.explodeImage(i);
        this.exploded[i] = true;
      }
    }
  }

  overImage(x, y, imgData) {
    return (
      x > imgData.x - imgData.w / 2 &&
      x < imgData.x + imgData.w / 2 &&
      y > imgData.y - imgData.h / 2 &&
      y < imgData.y + imgData.h / 2
    );
  }

  drawPixelated(img, data) {
    const step = 10;
    noStroke();
    for (let ix = 0; ix < img.width; ix += step) {
      for (let iy = 0; iy < img.height; iy += step) {
        const c = img.get(ix, iy);
        if (alpha(c) < 10) continue;
        const sx = map(ix, 0, img.width, data.x - data.w / 2, data.x + data.w / 2);
        const sy = map(iy, 0, img.height, data.y - data.h / 2, data.y + data.h / 2);
        fill(c);
        rect(sx, sy, step, step);
      }
    }
  }

  explodeImage(i) {
    const img = explodeImgs[i];
    const data = this.explodeXY[i];
    const step = 6;
    for (let ix = 0; ix < img.width; ix += step) {
      for (let iy = 0; iy < img.height; iy += step) {
        const c = img.get(ix, iy);
        if (alpha(c) < 10) continue;
        const sx = map(ix, 0, img.width, data.x - data.w / 2, data.x + data.w / 2);
        const sy = map(iy, 0, img.height, data.y - data.h / 2, data.y + data.h / 2);
        this.particles.push(new ExplosionParticle(sx, sy, c));
      }
    }
  }

  allExploded() {
    return this.exploded.every(e => e);
  }

  cleanup() {
    this.explodeXY = [];
    this.exploded = [];
    this.particles = [];
    this.finished = false;
  }
}

class ExplosionParticle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4);
    this.vy = random(-6, -1);
    this.gravity = 0.2;
    this.col = col;
    this.size = 10;
    this.life = 255;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 4;
  }

  show() {
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);
    rect(this.x, this.y, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

class Scene2C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#9a0000ff");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("ANGER", width / 2, height / 2 + 35);
    
    if (this.textAlpha >= 255) {
      this.promptAlpha = min(this.promptAlpha + 3, 255);
      fill(255, this.promptAlpha);
      textAlign(CENTER, BOTTOM);
      textSize(18);
      text("press SPACE to continue", width / 2, height - 40);
    }
  }
  
  cleanup() {}
}