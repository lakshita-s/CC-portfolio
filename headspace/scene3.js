class Scene3 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    playMusic(music.scene3);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#eb6a00ff");
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 3", width/2, height/2);
    
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

class Scene3A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
      [1,1,1,1,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1,1,1,0,0],
      [1,0,1,1,1,1,0,0,0,0,1,0],
      [1,0,0,0,0,1,1,1,1,0,1,0],
      [1,1,1,1,0,1,0,0,1,0,1,0],
      [1,0,0,1,0,1,1,0,1,0,0,0],
      [1,0,1,1,0,1,0,0,1,1,1,1],
      [1,0,0,0,0,1,0,1,1,0,0,1],
      [1,1,1,1,0,1,0,0,0,0,1,1],
      [0,0,0,1,0,1,1,1,1,0,0,0],
      [1,1,0,0,0,0,0,0,1,1,1,0],
      [1,1,1,1,1,1,1,0,0,0,0,0]
    ];

    const dotCells = [
      { col: 2, row: 1 },
      { col: 1, row: 5 },
      { col: 10, row: 7 }
    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 10, row: 0 },
      goalCell: { col: 6, row: 4 },
      dotCells: dotCells,
      wallColor: { r: 277, g: 114, b: 54, a: 255 },
      glowColor: { r: 255, g: 148, b: 99, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[3]);
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

class Scene3B {
  constructor() {
    this.stage = 1;
    this.bonfireBuffer = null;
    this.particles = [];
    this.size = 5;
    this.res = 5;
    this.speed = 0.5;
    this.startTime = 0;
    this.finished = false;
    this.textAlpha = 0;
  }

  setup() {
    this.bonfireBuffer = createGraphics(600, 500);
    this.bonfireBuffer.imageMode(CENTER);
    this.particles = [];
    for (let i = 0; i < 600; i += this.res) {
      for (let j = 0; j < 500; j += this.res) {
        this.particles.push({ x: i, y: j, gridX: i / this.res, gridY: j / this.res });
      }
    }
    this.startTime = millis();
    this.finished = false;
    this.textAlpha = 0;
  }

  display() {
    if (!this.bonfireBuffer) this.setup();
    background(10);
    
    this.bonfireBuffer.background(10);
    this.bonfireBuffer.push();
    this.bonfireBuffer.translate(300, 250);
    this.bonfireBuffer.scale(0.7);
    
    const fires = [fire1, fire2, fire3, fire4, fire5, fire6];
    const logs = [log1, log2, log3, log4, log5, log6];
    
    for (let i = 0; i < this.stage; i++) {
      this.bonfireBuffer.image(logs[i], 0, 10);
      this.bonfireBuffer.image(fires[i], 0, 20);
    }
    this.bonfireBuffer.pop();
    
    const t = frameCount * this.speed;
    noStroke();
    for (let p of this.particles) {
      const hShift = (p.gridY % 2 === 0 ? 1 : -1) * sin(t) * this.res;
      const vShift = (p.gridX % 2 === 0 ? 1 : -1) * cos(t * 1.1) * this.res;
      const col = this.bonfireBuffer.get(int(p.x), int(p.y));
      fill(col);
      rect(p.x + hShift, p.y + vShift, this.size);
    }
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("click on the screen, TEND to the fire", width / 2, 40);
    
    if (!this.finished && this.stage >= 6 && millis() - this.startTime > 15000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  mousePressed() {
    if (mouseX > 150 && mouseX < 450 && mouseY > 150 && mouseY < 400) {
      if (this.stage < 6) {
        this.stage++;
        if (this.stage === 1) this.startTime = millis();
      }
    }
  }

  cleanup() {
    this.stage = 0;
    this.bonfireBuffer = null;
    this.particles = [];
  }
}

class Scene3C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#eb6a00ff");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("WARMTH", width / 2, height / 2 + 35);
    
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