"use strict";

let tvState = "off"; // "off" | "home" | "guide" | "channel" | "about"
let currentChannelIndex = 0;

const screenEl     = document.getElementById("tv-screen");
const bottomTextEl = document.getElementById("tv-bottom-text");

const btnOnOff  = document.querySelector(".btn-onoff");
const btnMenu   = document.querySelector(".btn-menu");
const btnStar   = document.querySelector(".btn-star");
const btnLeft   = document.querySelector(".btn-left");
const btnRight  = document.querySelector(".btn-right");

// sound
const typeSound = document.getElementById("type-sound");
const staticSound = document.getElementById("static-sound");
const buttonSound = document.getElementById("button-sound");

let typeSoundTimeout = null;
const TYPE_DURATION = 1500;

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  if (typeSound) {
    typeSound.volume = 0.35;
    typeSound.currentTime = 0;
    typeSound.play().then(() => {
      typeSound.pause();
      typeSound.currentTime = 0;
    }).catch(() => {});
  }
  
  if (staticSound) {
    staticSound.volume = 0.2;
    staticSound.currentTime = 0;
    staticSound.play().then(() => {
      staticSound.pause();
      staticSound.currentTime = 0;
    }).catch(() => {});
  }
  
  if (buttonSound) {
    buttonSound.volume = 0.4;
  }
  
  audioUnlocked = true;
}

function playButtonSound() {
  if (!buttonSound || !audioUnlocked) return;
  buttonSound.currentTime = 0;
  buttonSound.volume = 0.4;
  buttonSound.play().catch(err => {
    console.warn("Button sound blocked:", err);
  });
}

function startStaticSound() {
  if (!staticSound || !audioUnlocked) return;
  staticSound.currentTime = 0;
  staticSound.loop = true;
  staticSound.volume = 0.2;
  staticSound.play().catch(err => {
    console.warn("Static sound blocked:", err);
  });
}

function stopStaticSound() {
  if (!staticSound) return;
  staticSound.pause();
  staticSound.currentTime = 0;
}

function startTypingSound() {
  if (!typeSound || !audioUnlocked) return;

  if (typeSoundTimeout !== null) {
    clearTimeout(typeSoundTimeout);
    typeSoundTimeout = null;
  }

  typeSound.currentTime = 0;
  typeSound.loop = true;
  typeSound.volume = 0.35;

  typeSound.play().catch(err => {
    console.warn("Audio play blocked:", err);
  });

  typeSoundTimeout = setTimeout(stopTypingSound, TYPE_DURATION);
}

function stopTypingSound() {
  if (!typeSound) return;
  typeSound.pause();
  typeSound.currentTime = 0;

  if (typeSoundTimeout !== null) {
    clearTimeout(typeSoundTimeout);
    typeSoundTimeout = null;
  }
}

// channels
const channels = [
  { number: 1, name: "channel 1 – lost & found (tea farm)", embedUrl: "pages/channel1.html", description: "a tea farm in the 'tea capital' of India- Munnar- my lost and found place. it's a fond memory from my childhood. the farm is spread across rolling hills at varying heights, covered with rows of planted tea- with narrow dirt paths, and silver oak trees spread across." },
  { number: 2, name: "channel 2 – random face generator", embedUrl: "pages/channel2.html", description: "just a lil loopy random face generator. my first experience with interaction in a coding language!" },
  { number: 3, name: "channel 3 – experimental clock", embedUrl: "pages/channel3.html", description: "experimental clock using visual imagery of a vinyl record, which has a genre of music for each hour; the genre can be seen by hovering over the segments around the clock. the images in the center of the record also change according to the genre of that hour." },
  { number: 4, name: "channel 4 – exquisite corpse (Buff Cat Monster)", embedUrl: "pages/channel4.html", description: "an exquisite corpse done as a group project led to the birth offff... buff cat monster! i did the magical cat witch part :))" },
  { number: 5, name: "channel 5 – optical illusion", embedUrl: "pages/channel5.html", description: "inspo: patola weaving; a popular indian textile method. my attempt at translating the abstract shapes of patola grid patterns to an animating illusion. patt vira's truchet tiles tutorial used!" },
  { number: 6, name: "channel 6 – data portrait", embedUrl: "pages/channel6.html", description: "data portrait of my personal habit; how many times i put my rings on and take them off in one day, over the course of a week. (why track this habit: i like to wear a lot of rings but get overstimulated easily and feel my fingers change in size often ++ i've got one ring i almost never take off)" },
  { number: 7, name: "channel 7 – headspace", embedUrl: "https://lakshita-s.github.io/headspace/", description: "a game of search and discovery; finding all your emotions once again after a period of mental struggle and numbness; becoming a whole person again- finding yourself. inspired by omori, life is strange, stardew valley, oxenfree." },
  { number: 8, name: "channel 8 – my other art", embedUrl: "pages/channel8.html", description: "some of my other artwork! i like to do a little bit of everything." }
];

// about text
const aboutText = `
hello! i'm lakshita! i'm a design & technology student at parsons, interested in
interactive experiences, and emotional, empathetic and highly intentinal design. i like to use philosophical themes in my artistic expression, and generally create from a place of personal experience, or an evaluation of the human condition. i'm very new to the world of coding, but i've always enjoyed niche internet surfing and playing video games; the few non-grandma hobbies i have (i like to embroider, bake, "take walks").
this portfolio gathers the projects from my Critical Computation class, of my sophomore year, fall 2025.
`;

// buttons

btnOnOff.addEventListener("click", () => {
  unlockAudio();
  playButtonSound();

  tvState = tvState === "off" ? "home" : "off";
  render();
});

btnMenu.addEventListener("click", () => {
  unlockAudio();
  playButtonSound();

  if (tvState === "off") return;
  tvState = tvState === "guide" ? "home" : "guide";
  render();
});

btnStar.addEventListener("click", () => {
  unlockAudio();
  playButtonSound();

  if (tvState === "off") return;
  tvState = "about";
  render();
});

btnRight.addEventListener("click", () => {
  unlockAudio();
  playButtonSound();

  if (tvState === "off") return;
  
  if (tvState === "guide" || tvState === "home" || tvState === "about") {
    currentChannelIndex = 0;
  } else {
    currentChannelIndex = (currentChannelIndex + 1) % channels.length;
  }
  
  tvState = "channel";
  render();
});

btnLeft.addEventListener("click", () => {
  unlockAudio();
  playButtonSound();

  if (tvState === "off") return;
  
  if (tvState === "guide" || tvState === "home" || tvState === "about") {
    currentChannelIndex = 0;
  } else {
    currentChannelIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
  }
  
  tvState = "channel";
  render();
});


function render() {
  screenEl.className = "tv-screen";
  bottomTextEl.classList.remove("hidden");

  if (tvState === "off") {
    renderOff();
  } else if (tvState === "home") {
    renderHome();
  } else if (tvState === "guide") {
    renderGuide();
  } else if (tvState === "channel") {
    renderChannel();
  } else if (tvState === "about") {
    renderAbout();
  }
}

// indv screens

// tv off - static
function renderOff() {
  stopTypingSound();
  startStaticSound();

  screenEl.classList.add("embed-mode");
  screenEl.innerHTML = `
    <div class="tv-embed-wrapper full">
      <iframe src="static-sketch.html"></iframe>
    </div>
  `;
  bottomTextEl.textContent = "press ON/OFF to turn this TV on!";
}

// home 
function renderHome() {
  stopStaticSound();
  
  screenEl.classList.add("text-mode");
  screenEl.innerHTML = `
    <div class="text-page">
      <div class="text-content">
        <h2>welcome to lakshita's critical computation portfolio!</h2>
        <p>here's how to navigate:</p>
        <ul>
          <li>press the <strong>menu</strong> button to see the TV GUIDE (projects list).</li>
          <li>press the <strong>arrow</strong> buttons to flip between channels.</li>
          <li>press the <strong>star</strong> button to see lakshita's ABOUT page.</li>
        </ul>
        <p>enjoy the show!</p>
      </div>
    </div>
  `;
  bottomTextEl.textContent = "";

  startTypingSound();
}

// TV guide
function renderGuide() {
  stopStaticSound();
  
  screenEl.classList.add("text-mode");

  const listItems = channels
    .map(ch => `<li>${ch.name}</li>`)
    .join("");

  screenEl.innerHTML = `
    <div class="text-page">
      <div class="text-content">
        <h2>TV GUIDE</h2>
        <p>use the arrow buttons to flip through channels.</p>
        <ul class="guide-list">
          ${listItems}
        </ul>
      </div>
    </div>
  `;

  startTypingSound();
}

// channel view 
function renderChannel() {
  stopStaticSound();
  stopTypingSound();

  const ch = channels[currentChannelIndex];

if (ch.embedUrl) {
    screenEl.classList.add("embed-mode");
    
    let wrapperClass = (currentChannelIndex === 6) ? "game" : "scaled";
    
    screenEl.innerHTML = `
      <div class="tv-embed-wrapper ${wrapperClass}">
        <iframe src="${ch.embedUrl}"></iframe>
      </div>
    `;
  } else {
    screenEl.classList.add("text-mode");
    screenEl.innerHTML = `
      <div class="text-page">
        <div class="text-content">
          <h2>${ch.name}</h2>
          <p>Surprise coming soon… 👀</p>
        </div>
      </div>
    `;
    startTypingSound();
  }

  bottomTextEl.textContent = ch.description || "";

  if (ch.description) {
    bottomTextEl.classList.remove('typing');
    // Force reflow to restart animation
    void bottomTextEl.offsetWidth;
    bottomTextEl.classList.add('typing');
  }
}

// about screen
function renderAbout() {
  stopStaticSound();
  
  screenEl.classList.add("text-mode");
  screenEl.innerHTML = `
    <div class="text-page about-page">
      <div class="text-content">
        <h2>ABOUT</h2>
        <p>${aboutText}</p>
      </div>
    </div>
  `;
  bottomTextEl.textContent = "";
  bottomTextEl.classList.add("hidden");

  startTypingSound();
}

render();
