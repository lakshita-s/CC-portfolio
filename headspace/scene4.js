class Scene4 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    playMusic(music.scene4);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#ce128cff");
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 4", width/2, height/2);
    
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

class Scene4A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,1,0,1],
  [1,1,1,0,0,0,0,1,1,0,0,1],
  [0,0,0,1,1,1,0,0,1,0,1,1],
  [0,1,0,0,0,0,1,0,0,0,0,1],
  [0,1,1,1,1,0,1,1,1,1,0,1],
  [0,0,0,0,1,0,0,0,0,1,0,1],
  [1,1,1,0,1,1,1,1,0,1,0,1],
  [1,1,1,0,0,0,0,1,0,1,0,1],
  [0,0,0,1,1,1,0,1,0,1,0,1],
  [0,1,0,0,0,0,0,1,0,0,0,1],
  [0,1,1,1,1,1,1,1,1,1,1,1],
];

    const dotCells = [
      { col: 1, row: 1 },
      { col: 8, row: 1 },
      { col: 8, row: 9 },
      { col: 6, row: 11 }

    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 6, row: 4 },
      goalCell: { col: 0, row: 12 },
      dotCells: dotCells,
      wallColor: { r: 255, g: 85, b: 195, a: 255 },
      glowColor: { r: 255, g: 140, b: 215, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[4]);
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

class Scene4B {
  constructor() {
    this.particles = [];
    this.size = 2;
    this.res = 2;
    this.speed = 0.5;
    this.heartbeatSpeed = 0.1;
    this.startTime = 0;
    this.finished = false;
    this.textAlpha = 0;
  }

  setup() {
    playMusic(music.scene4B);
    scene4B_img1.resize(600, 500);
    this.spawnParticles();
    this.startTime = millis();
    this.finished = false;
    this.textAlpha = 0;
  }

  spawnParticles() {
    this.particles = [];
    for (let i = 0; i < 600; i += this.res) {
      for (let j = 0; j < 500; j += this.res) {
        const col = scene4B_img1.get(i, j);
        this.particles.push(new Scene4BParticle(i, j, col, this.res));
      }
    }
  }

  display() {
    background(0);
    const Time = frameCount * this.speed;
    this.particles.forEach(p => p.display(Time, this.size));
    
    push();
    blendMode(BLEND);
    imageMode(CENTER);
    const heartbeat = 1 + sin(frameCount * this.heartbeatSpeed) * 0.1;
    translate(width / 2, height / 2);
    scale(heartbeat);
    image(scene4B_img2, 0, 0, 500, 500);
    pop();
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("touch your palm to your chest, feel it BEAT", width / 2, 40);
    
    if (!this.finished && millis() - this.startTime > 15000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  cleanup() {
    this.particles = [];
  }
}

class Scene4BParticle {
  constructor(x, y, color, res) {
    this.baseX = x;
    this.baseY = y;
    this.color = color;
    this.gridX = x / res;
    this.gridY = y / res;
    this.res = res;
  }

  display(Time, size) {
    const hShift = (this.gridY % 2 === 0 ? 1 : -1) * sin(Time) * this.res;
    const vShift = (this.gridX % 2 === 0 ? 1 : -1) * cos(Time * 1.1) * this.res;
    push();
    blendMode(DIFFERENCE);
    fill(this.color);
    noStroke();
    rect(this.baseX + hShift, this.baseY + vShift, size);
    pop();
  }
}

class Scene4C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#ce128cff");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("LOVE", width / 2, height / 2 + 35);
    
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