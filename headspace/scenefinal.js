class SceneFinal {
  constructor() {
    this.player = null;
    this.doorX = 250;
    this.doorWidth = 100;
    this.doorHeight = 60;
    this.sceneOpacity = 255;
    this.textOpacity = 255;
    this.nearMirror = false;
  }

  setup() {
    playMusic(music.final);
    imageMode(CENTER);
    this.player = new Player(300, 450, playerImgs[7], true);
    this.sceneOpacity = 255;
    this.textOpacity = 255;
    this.nearMirror = false;
  }

  display() {
    background(255);
    
    push();
    tint(255, this.sceneOpacity);
    this.drawDoor();
    image(mirrorImg, 250, 200, 100, 150);
    pop();
    
    this.player.update();
    push();
    tint(255, this.sceneOpacity);
    this.player.display();
    pop();
    
    if (dist(this.player.x, this.player.y, 250, 200) < 50) {
      this.nearMirror = true;
      fill(0, this.textOpacity);
      textAlign(CENTER);
      textSize(20);
      text("press space to ACCEPT yourself.", width / 2, 80);
    }
  }

  keyPressed() {
    if (this.nearMirror) {
      sceneManager.nextScene();
    }
  }

  drawDoor() {
    push();
    translate(this.doorX, height);
    scale(1, -1);
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

  cleanup() {
    this.player = null;
  }
}

class SceneFinalA {
  constructor() {
    this.hugOpacity = 0;
    this.forgiveOpacity = 0;
    this.forgiveState = 'fadeIn';
    this.startTime = 0;
    this.stateTimer = 0;
    this.finished = false;
  }

  setup() {
    this.hugOpacity = 0;
    this.forgiveOpacity = 0;
    this.forgiveState = 'fadeIn';
    this.startTime = millis();
    this.stateTimer = 0;
    this.finished = false;
  }

  display() {
    background(255);
    
    if (this.hugOpacity < 255) {
      this.hugOpacity = min(this.hugOpacity + 3, 255);
      if (this.hugOpacity === 255) {
        this.stateTimer = frameCount;
      }
    }
    
    push();
    tint(255, this.hugOpacity);
    image(huggingImg, width / 2, height / 2, 200, 200);
    pop();
    
    if (this.hugOpacity === 255) {
      if (this.forgiveState === 'fadeIn') {
        this.forgiveOpacity = min(this.forgiveOpacity + 2, 255);
        if (this.forgiveOpacity === 255) {
          this.forgiveState = 'hold';
          this.stateTimer = frameCount;
        }
      } else if (this.forgiveState === 'hold') {
        if (frameCount - this.stateTimer > 180) { 
          this.forgiveState = 'fadeOut';
        }
      } else if (this.forgiveState === 'fadeOut') {
        this.forgiveOpacity = max(this.forgiveOpacity - 2, 0);
        this.hugOpacity = max(this.hugOpacity - 2, 0);
      }
      
      if (this.forgiveOpacity > 0) {
        fill(0, this.forgiveOpacity);
        textAlign(CENTER);
        textSize(15);
        text("i forgive you.", width / 2 - 130, height / 2);
      }
    }
    
    if (!this.finished && millis() - this.startTime > 10000) {
      this.finished = true;
      sceneManager.nextScene();
    }
  }

  cleanup() {}
}

class SceneFinalB {
  constructor() {
    this.textAlpha = 0;
    this.textState = 'fadeIn';
    this.stateTimer = 0;
  }

  setup() {
    this.textAlpha = 0;
    this.textState = 'fadeIn';
    this.stateTimer = 0;
  }

  display() {
    background(255);
    
    if (this.textState === 'fadeIn') {
      this.textAlpha = min(this.textAlpha + 3, 255);
      if (this.textAlpha === 255) {
        this.textState = 'hold';
        this.stateTimer = frameCount;
      }
    } else if (this.textState === 'hold') {
      if (frameCount - this.stateTimer > 120) { 
        this.textState = 'fadeOut';
      }
    } else if (this.textState === 'fadeOut') {
      this.textAlpha = max(this.textAlpha - 2, 0);
    }
    
    fill(0, this.textAlpha);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("you did it. you have found yourself.\nnow, you must continue onwards.", width / 2, height / 2);
  }

  cleanup() {}
}