class SceneManager {
  constructor() {
    this.currentScene = 0;
    this.scenes = [
      new Scene0(),
      new Scene1(),
      new Scene1A(),
      new Scene1B(),
      new Scene1C(),
      new Scene2(),
      new Scene2A(),
      new Scene2B(),
      new Scene2C(),
      new Scene3(),
      new Scene3A(),
      new Scene3B(),
      new Scene3C(),
      new Scene4(),
      new Scene4A(),
      new Scene4B(),
      new Scene4C(),
      new Scene5(),
      new Scene5A(),
      new Scene5B(),
      new Scene5C(),
      new Scene6(),
      new Scene6A(),
      new Scene6B(),
      new Scene6C(),
      new SceneBoss(),     
      new SceneBossA(),     
      new SceneBossB(),    
      new SceneBossC(),
      new Scene7(),
      new Scene7A(),
      new Scene7B(),
      new Scene7C(),
      new SceneFinal(),
      new SceneFinalA(),
      new SceneFinalB()
    ];
  }

  setupCurrent() {
    this.scenes[this.currentScene].setup?.();
  }

  display() {
    const s = this.scenes[this.currentScene];
    if (s.__broken) {
      background(20);
      fill(255, 80, 80);
      textAlign(LEFT, TOP);
      textSize(14);
      text(
        "Scene failed to load.\nDetails: " + (s.__broken.message || s.__broken),
        12, 12
      );
      return;
    }
    s.display?.();
  }

  keyPressed() {
    this.scenes[this.currentScene].keyPressed?.();
  }

  mousePressed() {
    this.scenes[this.currentScene].mousePressed?.();
  }

  nextScene() {
    this.scenes[this.currentScene].cleanup?.();
    if (this.currentScene < this.scenes.length - 1) {
      this.currentScene++;
      try {
        this.scenes[this.currentScene].setup?.();
        console.log("Switched to scene:", this.currentScene);
      } catch (e) {
        console.error("Error in setup() for scene", this.currentScene, e);
        this.scenes[this.currentScene].__broken = e;
      }
    }
  }
}