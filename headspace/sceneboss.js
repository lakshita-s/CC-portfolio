// ========== BOSS INTRO ==========
class SceneBoss {
  constructor() {
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }

  setup() {
    playMusic(music.boss);
    this.titleAlpha = 0;
    this.promptAlpha = 0;
  }

  display() {
    background(0);

    blendMode(NORMAL);
    
    this.titleAlpha = min(this.titleAlpha + 3, 255);
    fill(255, this.titleAlpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("BOSS LEVEL", width/2, height/2);
    
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

// ========== BOSS INSTRUCTIONS ==========
class SceneBossA {
  constructor() {
    this.textAlpha = 0;
    this.textState = "fadeIn";
    this.textTimer = 0;
    this.showPrompt = false;
    this.promptAlpha = 0;
  }

  setup() {
    this.textAlpha = 0;
    this.textState = "fadeIn";
    this.textTimer = 0;
    this.showPrompt = false;
    this.promptAlpha = 0;
  }

  display() {
    background(0);
    
    // Fade in main text
    if (this.textState === "fadeIn") {
      this.textAlpha = min(this.textAlpha + 3, 255);
      if (this.textAlpha === 255) this.textState = "hold";
    } else if (this.textState === "hold") {
      this.textTimer++;
      if (this.textTimer > 120) {
        this.showPrompt = true;
      }
    }
    
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("you have fought hard to feel again—\nand the Monster still lurks.\n\nbut fear is good, as fear only comes\nfrom desire to protect.\n\nyou must finally protect yourself.", width / 2, height / 2 - 40);
    
    if (this.showPrompt) {
      this.promptAlpha = min(this.promptAlpha + 3, 255);
      fill(200, this.promptAlpha);
      textAlign(CENTER, BOTTOM);
      textSize(16);
      text("press arrow keys to MOVE, and S to SHOOT", width / 2, height - 40);
    }
  }

  cleanup() {}
}

// ========== BOSS FIGHT ==========
class SceneBossB {
  constructor() {
    this.player = null;
    this.monster = null;
    this.bullets = [];
    this.hits = 0;
    this.requiredHits = 5;
    this.finished = false;
  }

  setup() {
    imageMode(CENTER);
    this.player = new Player(60, height/2, playerImgs[6], true);
    this.monster = new BossMonster();
    this.bullets = [];
    this.hits = 0;
    this.finished = false;
  }

  display() {
    background(0);
    blendMode(NORMAL);
    
    this.monster.update();
    this.monster.display();
    this.player.update();
    this.player.display();
    
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let b = this.bullets[i];
      b.update();
      b.display();
      
      if (!b.alive) {
        this.bullets.splice(i, 1);
        continue;
      }
      
      if (!this.monster.dead && b.collidesWith(this.monster)) {
        this.hits++;
        b.alive = false;
        this.bullets.splice(i, 1);
        if (this.hits >= this.requiredHits) {
          this.monster.dead = true;
        }
      }
    }
    
    // Health bar
    let maxHP = this.requiredHits;
    let currentHP = maxHP - this.hits;
    let hpRatio = constrain(currentHP / maxHP, 0, 1);
    let barWidth = 220;
    let barHeight = 16;
    let barX = width / 2 - barWidth / 2;
    let barY = 30;
    
    push();
    rectMode(CORNER);
    noStroke();
    fill(60);
    rect(barX, barY, barWidth, barHeight, 4);
    fill(140, 0, 0);
    rect(barX, barY, barWidth * hpRatio, barHeight, 4);
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(18);
    text("HEALTH BAR", width / 2, barY - 4);
    pop();
    
    if (!this.finished && this.monster.dead && this.monster.alpha <= 0) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  keyPressed() {
    if (key === "s" || key === "S") {
      if (!this.monster.dead) this.shootBullet();
    }
  }

  shootBullet() {
    let b = new Bullet(this.player.x + 20, this.player.y);
    this.bullets.push(b);
  }

  cleanup() {
    this.player = null;
    this.monster = null;
    this.bullets = [];
  }
}

// ========== BOSS VICTORY ==========
class SceneBossC {
  constructor() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }

  setup() {
    this.textAlpha = 0;
    this.promptAlpha = 0;
  }

  display() {
    background(0);
    
    this.textAlpha = min(this.textAlpha + 3, 255);
    fill(255, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("congrats!\nyou have found", width / 2, height / 2 - 65);
    textSize(64);
    text("DESIRE", width / 2, height / 2 + 35);
    
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

// Boss Monster class (unchanged)
class BossMonster {
  constructor() {
    this.x = width - 100;
    this.y = height / 2;
    this.w = 250;
    this.h = 250;
    this.speed = 3;
    this.direction = 1;
    this.dead = false;
    this.alpha = 255;
  }

  update() {
    if (!this.dead) {
      this.y += this.speed * this.direction;
      if (this.y < this.h/2 || this.y > height - this.h/2) {
        this.direction *= -1;
      }
    } else {
      this.alpha -= 4;
      if (this.alpha < 0) this.alpha = 0;
    }
  }

  display() {
    push();
    tint(255, this.alpha);
    image(monsterImg, this.x, this.y, this.w, this.h);
    pop();
  }
}

// Bullet class (unchanged)
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.speed = 8;
    this.alive = true;
  }

  update() {
    this.x += this.speed;
    if (this.x > width + this.size) this.alive = false;
  }

  display() {
    if (!this.alive) return;
    image(bulletImg, this.x, this.y, this.size, this.size);
  }

  collidesWith(monster) {
    let d = dist(this.x, this.y, monster.x, monster.y);
    let threshold = (this.size/2 + max(monster.w, monster.h)/2) * 0.6;
    return d < threshold;
  }
}