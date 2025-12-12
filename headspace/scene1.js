 class Scene1 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#006bd4");
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 1", width/2, height/2);
    
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

class Scene1A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,1],
      [1,1,1,1,1,0,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,1,0,0,0,1,1,1,1,1,1],
      [1,0,1,0,1,1,0,0,0,0,0,1],
      [1,0,1,0,0,0,0,1,1,1,0,1],
      [1,1,1,1,1,1,0,1,1,1,1,1]
    ];

    const dotCells = [
      { col: 3, row: 1 },
    //   { col: 5, row: 3 },
      { col: 2, row: 5 },
      { col: 8, row: 7 },
      { col: 1, row: 10}
    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 6, row: 11 },
      goalCell: { col: 0, row: 1 },
      dotCells: dotCells,
      wallColor: { r: 50, g: 80, b: 200, a: 255 },
      glowColor: { r: 100, g: 150, b: 255, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[1]);
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
    this.completed = false;
  }
}

class Scene1B {
  constructor() {
    this.particles = [];
    this.size = 20;
    this.res = 2;
    this.speed = 0.5;
    this.startTime = 0;
    this.finished = false;
  }

  setup() {
    scene1B_img.resize(600, 500);
    scene1B_vid.loop();
    this.spawnParticles();
    this.startTime = millis();
    this.finished = false;
  }

  spawnParticles() {
    this.particles = [];
    for (let i = 0; i < width; i += this.res) {
      for (let j = 0; j < height; j += this.res) {
        const col = scene1B_img.get(i, j);
        this.particles.push(new Scene1BParticle(i, j, col, this.res));
      }
    }
  }

  display() {
    background(255);
    const Time = frameCount * this.speed;
    this.particles.forEach(p => p.display(Time, this.size));
    
    push();
    blendMode(DARKEST);
    imageMode(CENTER);
    image(scene1B_vid, 400, 300, width + 100, height + 100);
    pop();
    
    if (!this.finished && millis() - this.startTime > 15000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  cleanup() {
    scene1B_vid.pause();
    this.particles = [];
  }
}

class Scene1BParticle {
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
    noStroke();
    fill(this.color);
    ellipse(this.baseX + hShift, this.baseY + vShift, size);
  }
}

class Scene1C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#006bd4");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("SADNESS", width / 2, height / 2 + 35);
    
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
