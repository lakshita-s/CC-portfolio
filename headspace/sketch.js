let sceneManager;
const SPACE = 32;
let myFont;

let playerImgs = {};
let collectImg;
let scene1B_img, scene1B_vid;
let explodeImgs = [];
let fire1, fire2, fire3, fire4, fire5, fire6;
let log1, log2, log3, log4, log5, log6;
let scene4B_img1, scene4B_img2;
let scene5B_img, scene5B_vid;
let scribbleImg, monsterImg;
let scene7B_vid;
let bulletImg;
let mirrorImg, huggingImg;
let music = {};

function preload() {
  
  for (let i = 1; i <= 7; i++) {
    playerImgs[i] = loadImage(`pngassets/player${i}.png`);
  }
  
  collectImg = loadImage("pngassets/collect.png");
  myFont = loadFont("otherassets/bedstead.bold-semi-condensed.otf");
  
  scene1B_img = loadImage("pngassets/cyan.png");
  scene1B_vid = createVideo("otherassets/flowerdying.mp4");
  scene1B_vid.hide();
  scene1B_vid.volume(0);
  
  explodeImgs = [
    loadImage("pngassets/mug.png"),
    loadImage("pngassets/plate.png"),
    loadImage("pngassets/glass.png"),
    loadImage("pngassets/glass2.png"),
    loadImage("pngassets/teapot.png"),
    loadImage("pngassets/tv.png")
  ];
  
  fire1 = loadImage("pngassets/fire1.PNG");
  fire2 = loadImage("pngassets/fire2.PNG");
  fire3 = loadImage("pngassets/fire3.PNG");
  fire4 = loadImage("pngassets/fire4.PNG");
  fire5 = loadImage("pngassets/fire5.PNG");
  fire6 = loadImage("pngassets/fire6.PNG");
  log1 = loadImage("pngassets/log1.PNG");
  log2 = loadImage("pngassets/log2.PNG");
  log3 = loadImage("pngassets/log3.PNG");
  log4 = loadImage("pngassets/log4.PNG");
  log5 = loadImage("pngassets/log5.PNG");
  log6 = loadImage("pngassets/log6.PNG");
  
  scene4B_img1 = loadImage("pngassets/hearts1.png");
  scene4B_img2 = loadImage("pngassets/hearts2.png");
  
  scene5B_img = loadImage("pngassets/sunlight.png");
  scene5B_vid = createVideo("otherassets/sunflower.mp4");
  scene5B_vid.hide();
  scene5B_vid.volume(0);
  
  scribbleImg = loadImage("pngassets/scribble.png");
  monsterImg = loadImage("pngassets/monster.png");
  
  scene7B_vid = createVideo("otherassets/relief.mp4");
  scene7B_vid.hide();
  scene7B_vid.volume(0);
  
  bulletImg = loadImage("pngassets/bullet.png");
  
  mirrorImg = loadImage("pngassets/mirror.png");
  huggingImg = loadImage("pngassets/hugs.png");
  
  music.intro  = loadSound("otherassets/intro.mp3"); 
  music.scene2 = loadSound("otherassets/scene2.mp3"); 
  music.scene3 = loadSound("otherassets/scene3.mp3"); 
  music.scene4 = loadSound("otherassets/scene4.mp3"); 
  music.scene5 = loadSound("otherassets/scene5.mp3"); 
  music.scene6 = loadSound("otherassets/scene6.mp3"); 
  music.boss   = loadSound("otherassets/boss.mp3"); 
  music.scene7 = loadSound("otherassets/scene7.mp3"); 
  music.final  = loadSound("otherassets/final.mp3");
}


function setup() {
  createCanvas(600, 500);
  textFont(myFont);
  sceneManager = new SceneManager();
  sceneManager.setupCurrent();
}

function draw() {
  sceneManager.display();
}

function keyPressed() {
  if (keyCode === SPACE) {
    sceneManager.nextScene();
    return false;
  }
  sceneManager.keyPressed();
  return false;
}

function mousePressed() {
  sceneManager.mousePressed();
  return false;
}

function playMusic(track) {
  Object.values(music).forEach(m => {
    if (m.isPlaying()) m.stop();
  });
  
  if (track && !track.isPlaying()) {
    track.loop();
  }
}