class Scene7 {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    playMusic(music.scene7);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#ffffffff");
    
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(0, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("LEVEL 7", width/2, height/2);
    
    if (this.titleAlpha >= 255) {
      this.promptAlpha = min(this.promptAlpha + 3, 255);
      fill(0, this.promptAlpha);
      textAlign(CENTER, BOTTOM);
      textSize(18);
      text("press SPACE to start", width / 2, height - 40);
    }
  }
  
  cleanup() {}
}

class Scene7A {
  constructor() {
    this.player = null;
    this.maze = null;
    this.completed = false;
  }

  setup() {
    const mazeGrid = [
      [0,0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    const dotCells = [
    ];

    this.maze = new Maze(mazeGrid, {
      startCell: { col: 11, row: 6 },
      goalCell: { col: 5, row: 0},
      dotCells: dotCells,
      wallColor: { r: 227, g: 227, b: 227, a: 255 },
      glowColor: { r: 255, g: 255, b: 255, a: 40 }
    });

    this.player = new Player(this.maze.startX, this.maze.startY, playerImgs[7]);
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

class Scene7B {
  constructor() {
    this.particles = [];
    this.size = 8;      
    this.res = 6;       
    this.speed = 0.4;
    this.startTime = 0;
    this.finished = false;
  }

  setup() {
    scene7B_vid.loop();
    scene7B_vid.volume(0);
    scene7B_vid.speed(0.5);
    
    this.particles = [];
    for (let i = 0; i < width; i += this.res) {
      for (let j = 0; j < height; j += this.res) {
        this.particles.push({
          baseX: i,
          baseY: j,
          gridX: i / this.res,
          gridY: j / this.res
        });
      }
    }
    
    this.startTime = millis();
    this.finished = false;
  }

  display() {
    background(255);

    push();
    imageMode(CORNER);
    image(scene7B_vid, 0, 0, width, height);
    pop();
    
    const Time = frameCount * this.speed;   
    
    for (let p of this.particles) {
      const hShift = (p.gridY % 2 === 0 ? 1 : -1) * sin(Time) * 2;
      const vShift = (p.gridX % 2 === 0 ? 1 : -1) * cos(Time * 1.1) * 2;
      
      fill(0, 0, 0, 40); 
      ellipse(p.baseX + hShift, p.baseY + vShift, this.size);
    }
    pop();
    
    if (!this.finished && millis() - this.startTime > 19000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  cleanup() {
    scene7B_vid.pause();
    this.particles = [];
  }
}

class Scene7C {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }
  
  display() {
    background("#ffffffff");
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(0, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("RELIEF", width / 2, height / 2 + 35);
    
    if (this.textAlpha >= 255) {
      this.promptAlpha = min(this.promptAlpha + 3, 255);
      fill(0, this.promptAlpha);
      textAlign(CENTER, BOTTOM);
      textSize(18);
      text("press SPACE to RELEASE", width / 2, height - 40);
    }
  }
  
  cleanup() {}
}