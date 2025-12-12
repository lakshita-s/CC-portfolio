class Scene6 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    playMusic(music.scene6);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#1c001fff");

    blendMode(DIFFERENCE);
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 6", width/2, height/2);
    
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

class Scene6A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
      [1,0,1,1,1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,0,0,0,1,1,1],
      [1,0,0,0,1,0,0,1,0,1,0,1],
      [1,1,1,0,1,0,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0],
      [1,0,1,1,1,1,0,1,1,0,0,1],
      [0,0,0,0,0,1,0,0,0,1,0,1],
      [0,1,1,0,1,1,1,1,0,1,1,1],
      [0,0,0,0,0,1,0,1,0,1,0,0],
      [1,0,1,1,1,0,0,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,0],
      [0,0,1,0,1,0,0,0,1,0,1,0],
      [1,0,0,0,0,1,0,1,0,0,0,0]
    ];

    const dotCells = [
      { col: 2, row: 2 },
      { col: 6, row: 4 },
      { col: 8, row: 8 },
      { col: 4, row: 10 },
      {col: 10, row: 6 } 
    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 1, row: 0 },
      goalCell: { col: 11, row: 8 },
      dotCells: dotCells,
      wallColor: { r: 73, g: 42, b: 77, a: 255 },
      glowColor: { r: 132, g: 125, b: 133, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[6]);
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

class Scene6B {
  constructor() {
    this.scribbleLayers = [];
    this.monster = null;
    this.fadeIn = 0;
    this.monsterFade = 0;
    this.startTime = 0;
    this.finished = false;
  }

  setup() {
    imageMode(CENTER);
    this.scribbleLayers = [];
    for (let i = 0; i < 5; i++) {
      this.scribbleLayers.push({
        offsetX: 0,
        offsetY: 0,
        rotation: random(TWO_PI),
        rotSpeed: random(-0.05, 0.05),
        scale: 1.2 + i * 0.3,
        baseOpacity: random(150, 255)
      });
    }
    this.monster = {
      x: width / 2,
      y: height / 2,
      vx: random(-2, 2),
      vy: random(-2, 2),
      size: 40,
      maxSize: max(width, height) * 1.5,
      growthRate: 2
    };
    this.fadeIn = 0;
    this.monsterFade = 0;
    this.startTime = millis();
    this.finished = false;
  }

  display() {
    background(0);
    let centerX = width / 2;
    let centerY = height / 2;

    if (this.fadeIn < 255) this.fadeIn += 2;

    for (let s of this.scribbleLayers) {
      s.offsetX += random(-2, 2);
      s.offsetY += random(-2, 2);
      s.offsetX *= 0.95;
      s.offsetY *= 0.95;
      let alpha = s.baseOpacity * (this.fadeIn / 255);
      push();
      translate(centerX + s.offsetX, centerY + s.offsetY);
      rotate(s.rotation);
      tint(255, alpha);
      image(scribbleImg, 0, 0, scribbleImg.width * s.scale, scribbleImg.height * s.scale);
      pop();
      s.rotation += s.rotSpeed;
    }

    if (this.fadeIn > 150 && this.monsterFade < 255) this.monsterFade += 4;

    this.monster.vx += random(-0.5, 0.5);
    this.monster.vy += random(-0.5, 0.5);
    this.monster.vx = constrain(this.monster.vx, -6, 6);
    this.monster.vy = constrain(this.monster.vy, -6, 6);
    this.monster.x += this.monster.vx;
    this.monster.y += this.monster.vy;

    if (this.monster.x < 0 || this.monster.x > width) this.monster.vx *= -1;
    if (this.monster.y < 0 || this.monster.y > height) this.monster.vy *= -1;

    if (this.monster.size < this.monster.maxSize) {
      this.monster.size += this.monster.growthRate;
    }

    push();
    translate(this.monster.x, this.monster.y);
    tint(255, this.monsterFade);
    image(monsterImg, 0, 0, this.monster.size, this.monster.size);
    pop();
    noTint();

    if (!this.finished && millis() - this.startTime > 15000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  cleanup() {
    this.scribbleLayers = [];
    this.monster = null;
  }
}

class Scene6C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#1c001fff");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("FEAR", width / 2, height / 2 + 35);
    
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