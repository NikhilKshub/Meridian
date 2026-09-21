function pad(n) {
  return n.toString().padStart(2, "0");
}
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function tick() {
  const now = new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const dateLabel = `${MONTHS[now.getMonth()]} ${now.getDate()}`;
  document.getElementById("status-time").textContent = `${h}:${m}`;
  document.getElementById("status-date").textContent = dateLabel;

  const sundialHour = document.getElementById("sundial-hour");
  const sundialMinute = document.getElementById("sundial-minute");
  if (sundialHour && sundialMinute) {
    const hourDeg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
    const minuteDeg = now.getMinutes() * 6;
    sundialHour.style.transform = `rotate(${hourDeg}deg)`;
    sundialMinute.style.transform = `rotate(${minuteDeg}deg)`;
  }
  const bootDay = document.getElementById("boot-day");
  const bootDate = document.getElementById("boot-date");
  const bootTime = document.getElementById("boot-time");
  if (bootDay) bootDay.textContent = DAYS[now.getDay()];
  if (bootDate) bootDate.textContent = dateLabel;
  if (bootTime) bootTime.textContent = `${h}:${m}`;
}
tick();
setInterval(tick, 1000 * 15);

const QUOTES = [
  { text: "The flower that blooms in adversity is the rarest of all.", from: "Mulan" },
  { text: "Just keep swimming.", from: "Finding Nemo" },
  { text: "Hakuna Matata — it means no worries.", from: "The Lion King" },
  { text: "To infinity, and beyond!", from: "Toy Story" },
  { text: "You are braver than you believe.", from: "Winnie the Pooh" },
  { text: "Adventure is out there!", from: "Up" },
];

// boot screen
function runBootSequence() {
  const boot=document.getElementById("boot-screen");
  const line=document.getElementById("boot-line");
  const wordmark =document.getElementById("boot-wordmark");
  const signInBtn =document.getElementById("boot-signin");
  const quoteEl=document.getElementById("boot-quote");

  const quote =QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteEl.textContent=`"${quote.text}" — ${quote.from}`;

  requestAnimationFrame(() =>{
    line.classList.add("boot-line-active");
    wordmark.classList.add("boot-wordmark-active");
  });

  setTimeout(()=>signInBtn.classList.add("boot-signin-active"), 900);
  signInBtn.addEventListener("click",()=>{
    boot.classList.add("boot-hide");
    setTimeout(() => boot.remove(), 600);
  });
}
runBootSequence();

// desktop quote 
function initDesktopQuote() {
  const el = document.getElementById("desktop-quote");
  if (!el) return;
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  el.textContent = `"${quote.text}" — ${quote.from}`;
}
initDesktopQuote();

// mini player / now playing
function updateNowPlaying(title, isPlaying) {
  const strip = document.getElementById("now-playing");
  const titleEl = document.getElementById("now-playing-title");
  const subEl = document.getElementById("now-playing-sub");
  if (!title) {
    strip.classList.remove("visible");
    return;
  }
  strip.classList.add("visible");
  strip.classList.toggle("playing", isPlaying);
  titleEl.textContent = title;
  subEl.textContent = isPlaying ? "Now Playing" : "Paused";
}
document.getElementById("now-playing").addEventListener("click", () => openWindow("music"));

// window management
const apps = {
  notes:{title:"Notes" },
  calculator:{title: "Calculator", width: 300, height: 380 },
  music:{title:"Music", width: 340, height:560},
  pomodoro:{title:"Pomodoro"},
  paint:{title:"Paint", width:720, height: 520},
  snake:{title:"Snake", width:460, height: 560},
  terminal:{title:"Terminal"},
};

function saveToStorage(key,value) {
  try {
    localStorage.setItem(key,JSON.stringify(value));
  } catch(err){
    console.log("Couldn't save to storage:",err);
  }
}

function loadFromStorage(key, fallback) {
  try {
    const raw =localStorage.getItem(key);
    return raw ===null ? fallback : JSON.parse(raw);
  } catch(err){
    return fallback;
  }
}

let openWindows = {};
let topZIndex = 10;
let windowCount = 0;
let musicAudioRef = null;

function createWindowElement(appName){
  const config =apps[appName];
  const win=document.createElement("div");
  win.className="window";
  win.id = "window-" + appName;
  win.style.position="absolute";

  const offset =(windowCount % 6) * 28;
  win.style.left= (160 + offset) + "px";
  win.style.top=(80 + offset) + "px";
  windowCount++;
  win.style.width= (config.width || 380) + "px";
  win.style.height= (config.height || 260) + "px";

  win.innerHTML=`
    <div class="window-titlebar">
      <span class="window-title">${config.title}</span>
      <div class="window-btns">
        <button class="window-minimize">&#8211;</button>
        <button class="window-maximize">&#9633;</button>
        <button class="window-close">&times;</button>
      </div>
    </div>
    <div class="window-content">
      ${appName==="notes" ? getNotesHTML(): ""}
      ${appName==="calculator" ? getCalculatorHTML() : ""}
      ${appName==="pomodoro" ? getPomodoroHTML(): ""}
      ${appName==="terminal" ? getTerminalHTML(): ""}
      ${appName==="music" ? getMusicHTML(): ""}
      ${appName==="paint" ? getPaintHTML(): ""}
      ${appName==="snake" ? getSnakeHTML(): ""}
    </div>
  `;
  win.querySelector(".window-minimize").addEventListener("click", () => {
    win.classList.remove("maximized");
    win.classList.add("minimized");
    win.style.display = "none";
    updateDockAutohide();
  });
  win.querySelector(".window-close").addEventListener("click",()=>{
    closeWindow(appName);
  });

  let restoreState =null;
  win.querySelector(".window-maximize").addEventListener("click",()=>{
    if (win.classList.contains("maximized")){
      win.classList.remove("maximized");
      win.style.left=restoreState.left;
      win.style.top=restoreState.top;
      win.style.width=restoreState.width;
      win.style.height=restoreState.height;
    } else{
      restoreState ={
        left:win.style.left,
        top:win.style.top,
        width:win.style.width,
        height:win.style.height,
      };
      win.classList.add("maximized");
    }
    if (win.paintResize) setTimeout(win.paintResize, 0);
    updateDockAutohide(); 
  });
  win.addEventListener("mousedown", () => bringToFront(win));
  return win;
}

function openWindow(appName){
  if (openWindows[appName]){
    const win=openWindows[appName];
    if (win.classList.contains("minimized")){
      win.classList.remove("minimized");
      win.style.display="flex";
      updateDockAutohide();
    }
    bringToFront(win);
    return;
  }

  const win=createWindowElement(appName);
  document.getElementById("desktop").appendChild(win);
  openWindows[appName] =win;
  makeDraggable(win);
  if (appName ==="calculator") initCalculator(win);
  if (appName ==="pomodoro") initPomodoro(win);
  if (appName ==="notes") initNotes(win);
  if (appName ==="terminal") initTerminal(win);
  if (appName ==="music") initMusic(win);
  if (appName ==="paint") initPaint(win);
  if (appName ==="snake") initSnake(win);
  bringToFront(win);
}

function closeWindow(appName){
  const win = openWindows[appName];
  if (!win) return;
  if (appName==="music" &&musicAudioRef) {
    musicAudioRef.pause();
    musicAudioRef=null;
    updateNowPlaying(null,false);
  }
  if(win.snakeCleanup)win.snakeCleanup();
  win.style.transition ="opacity 0.15s ease,transform 0.15s ease";
  win.style.opacity="0";
  win.style.transform="scale(0.97)";
  setTimeout(()=>win.remove(), 150);
  delete openWindows[appName];
  updateDockAutohide();
}

function bringToFront(win){
  topZIndex =topZIndex+1;
  win.style.zIndex=topZIndex;
  document.querySelectorAll(".window").forEach((w) => w.classList.remove("active"));
  win.classList.add("active");
}
function makeDraggable(win){
  const header=win.querySelector(".window-titlebar");
  let isDragging=false;
  let offsetX=0;
  let offsetY=0;
  header.addEventListener("mousedown",(e)=>{
    if (win.classList.contains("maximized")) return;
    isDragging=true;
    offsetX=e.clientX -win.offsetLeft;
    offsetY=e.clientY -win.offsetTop;
    bringToFront(win);
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
  });
  document.addEventListener("mouseup", () => { isDragging = false; });
}
document.querySelectorAll(".app-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    openWindow(tile.dataset.app);
  });
});

// calculator
function getCalculatorHTML(){
  return `
    <div class="calc">
      <div class="calc-display" id="calc-display">0</div>
      <div class="calc-buttons">
        <button class="calc-btn calc-clear" data-key="clear">C</button>
        <button class="calc-btn" data-key="/">÷</button>
        <button class="calc-btn" data-key="*">×</button>
        <button class="calc-btn" data-key="backspace">⌫</button>
        <button class="calc-btn" data-key="7">7</button>
        <button class="calc-btn" data-key="8">8</button>
        <button class="calc-btn" data-key="9">9</button>
        <button class="calc-btn" data-key="-">−</button>
        <button class="calc-btn" data-key="4">4</button>
        <button class="calc-btn" data-key="5">5</button>
        <button class="calc-btn" data-key="6">6</button>
        <button class="calc-btn" data-key="+">+</button>
        <button class="calc-btn" data-key="1">1</button>
        <button class="calc-btn" data-key="2">2</button>
        <button class="calc-btn" data-key="3">3</button>
        <button class="calc-btn calc-equals" data-key="=" style="grid-row: span 2;">=</button>
        <button class="calc-btn" data-key="0" style="grid-column: span 2;">0</button>
        <button class="calc-btn" data-key=".">.</button>
      </div>
    </div>
  `;
}
function initCalculator(win){
  const display=win.querySelector("#calc-display");
  let expression="";
  win.querySelectorAll(".calc-btn").forEach((btn)=>{
    btn.addEventListener("click",()=>{
      const key=btn.dataset.key;
      if (key==="clear"){
        expression ="";
      } else if (key ==="backspace") {
        expression=expression.slice(0, -1);
      } else if(key==="="){
        try{
          expression=String(Function("return " + expression)());
        } catch (err){
          expression="Error";
        }
      }else{
        expression+=key;
      }
      display.textContent=expression || "0";
    });
  });
}

// pomodoro
function getPomodoroHTML(){
  return `
    <div class="pomodoro">
      <div class="pomo-tabs">
        <button class="pomo-tab active" data-mode="1500">Focus</button>
        <button class="pomo-tab" data-mode="300">Short Break</button>
        <button class="pomo-tab" data-mode="900">Long Break</button>
        <button class="pomo-tab" data-mode="custom">Custom</button>
      </div>
      <div class="pomo-custom-row" id="pomo-custom-row" style="display:none;">
        <input type="number" class="pomo-custom-input" id="pomo-custom-mins" min="1" max="180" placeholder="Minutes" />
        <button class="pomo-btn" id="pomo-custom-set">Set</button>
      </div>
      <div class="pomo-display" id="pomo-display">25:00</div>
      <div class="pomo-controls">
        <button class="pomo-btn" data-action="start">Start</button>
        <button class="pomo-btn" data-action="pause">Pause</button>
        <button class="pomo-btn" data-action="reset">Reset</button>
      </div>
    </div>
  `;
}
function initPomodoro(win) {
  const display=win.querySelector("#pomo-display");
  let totalSeconds=25 * 60;
  let modeSeconds=25 * 60;
  let intervalId=null;

  function render(){
    const minutes=Math.floor(totalSeconds / 60);
    const seconds=totalSeconds % 60;
    display.textContent=pad(minutes) + ":" + pad(seconds);
  }

  function start(){
    if (intervalId) return;
    intervalId=setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        return;
      }
      totalSeconds--;
      render();
    }, 1000);
  }
  function pause(){
    clearInterval(intervalId);
    intervalId=null;
  }
  function reset(){
    pause();
    totalSeconds=modeSeconds;
    render();
  }

  win.querySelectorAll(".pomo-btn").forEach((btn)=>{
    btn.addEventListener("click",()=>{
      const action=btn.dataset.action;
      if (action==="start") start();
      if (action==="pause") pause();
      if (action==="reset") reset();
    });
  });
  const customRow=win.querySelector("#pomo-custom-row");
  const customInput=win.querySelector("#pomo-custom-mins");
  const customSetBtn=win.querySelector("#pomo-custom-set");
  win.querySelectorAll(".pomo-tab").forEach((tab) => {
    tab.addEventListener("click",()=>{
      win.querySelectorAll(".pomo-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      pause();
      if (tab.dataset.mode==="custom") {
        customRow.style.display="flex";
        return;
      }
      customRow.style.display ="none";
      modeSeconds=parseInt(tab.dataset.mode);
      totalSeconds=modeSeconds;
      render();
    });
  });
  customSetBtn.addEventListener("click", () => {
    const mins = parseInt(customInput.value);
    if (!mins || mins <= 0) return;
    modeSeconds = mins * 60;
    totalSeconds = modeSeconds;
    render();
  });
  render();
}

// Notes
function getNotesHTML(){
  return`
    <div class="notes-toolbar">
      <button class="notes-tool" data-cmd="bold"><b>B</b></button>
      <button class="notes-tool" data-cmd="italic"><i>I</i></button>
      <button class="notes-tool" data-cmd="underline"><u>U</u></button>
    </div>
    <div class="notes-textarea" contenteditable="true" data-placeholder="Type here..."></div>
  `;
}
function initNotes(win){
  const textarea=win.querySelector(".notes-textarea");
  textarea.innerHTML=loadFromStorage("nebula-notes", "");
  win.querySelectorAll(".notes-tool").forEach((btn) => {
    btn.addEventListener("click",()=>{
      document.execCommand(btn.dataset.cmd);
      textarea.focus();
    });
  });
  textarea.addEventListener("input",()=>{
    saveToStorage("nebula-notes",textarea.innerHTML);
  });
}

// Terminal
function getTerminalHTML() {
  return `
    <div class="terminal">
      <div class="terminal-output" id="terminal-output">Meridian Terminal — type "help" to see commands</div>
      <div class="terminal-input-row">
        <span class="terminal-prompt">&gt;</span>
        <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" />
      </div>
    </div>
  `;
}
function initTerminal(win) {
  const output = win.querySelector("#terminal-output");
  const input = win.querySelector("#terminal-input");
  const commands = {
    help: () => "Commands: help, clear, date, whoami, apps, open <app>, theme <color>, joke, echo <text>",
    clear: () => { output.innerHTML = ""; return null; },
    date: () => new Date().toString(),
    whoami: () => "guest@meridian",
    apps: () => Object.keys(apps).join(", "),
    open: (args) => {
      const target = args[0];
      if (!target || !apps[target]) return `unknown app: ${target || "(none given)"}`;
      openWindow(target);
      setTimeout(() => {
        if (openWindows[target]) bringToFront(openWindows[target]);
      }, 0);
      return `opening ${target}...`;
    },
    theme: (args) => {
      const color = args[0];
      if (!color) return "usage: theme <hex color, e.g. #4d8dff>";
      const root = document.documentElement.style;
      root.setProperty("--accent", color);
      root.setProperty("--green", color);
      root.setProperty("--amber", color);
      root.setProperty("--blue", color);
      return `theme set to ${color}`;
    },
    echo: (args) => args.join(" ") || "",
    joke: () => {
      const jokes = [
        "Why don't eggs tell jokes? They'd crack each other up.",
        "I accidentally swallowed some food coloring. The doctor says I'm okay, but I feel like I've dyed a little inside.",
        "I have a joke about construction, but I'm still working on it.",
        "Why did the tomato turn red? Because it saw the salad dressing.",
        "I was going to tell a time-traveling joke, but you didn't like it.",
        "I ordered a chicken and an egg online. I'll let you know which comes first.",
        "My neighbor knocked on my door at 2 AM. Can you believe that? Luckily, I was still awake playing drums.",
        "My wallet is like an onion. Opening it makes me cry.",
        "I hate when people say age is just a number. Age is clearly a word.",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  };
  function printLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
  input.addEventListener("keydown",(e)=>{
    if (e.key!=="Enter")return;
    const typed=input.value.trim();
    if (typed==="") return;

    printLine("> " +typed);

    const parts=typed.split(" ");
    const commandName= parts[0].toLowerCase();
    const args=parts.slice(1);

    const commandFn = commands[commandName];
    if (commandFn) {
      const result = commandFn(args);
      if (result !== null) printLine(result);
    } else {
      printLine(`command not found: ${typed}`);
    }
    input.value = "";
  });
}

// Music
function getMusicHTML() {
  return `
    <div class="music-player">
      <div class="music-dropzone" id="music-dropzone">
        <input type="file" id="music-file-input" accept="audio/*" multiple hidden />
        <span>Drop audio files here, or click to choose</span>
      </div>
      <div class="vinyl-wrap">
        <div class="vinyl" id="music-vinyl">
          <div class="vinyl-label">&#9835;</div>
        </div>
      </div>
      <div class="music-title" id="music-title">No track loaded</div>
      <div class="music-artist" id="music-artist">—</div>
      <div class="music-progress-row">
        <span class="music-time" id="music-current">0:00</span>
        <input type="range" class="music-progress" id="music-progress" min="0" max="100" value="0" />
        <span class="music-time" id="music-duration">0:00</span>
      </div>
      <div class="music-controls">
        <button class="music-btn" id="music-prev">&#9664;&#9664;</button>
        <button class="music-btn music-play" id="music-play">&#9654;</button>
        <button class="music-btn" id="music-next">&#9654;&#9654;</button>
      </div>
      <div class="music-volume-row">
        <span class="music-vol-icon">&#128266;</span>
        <input type="range" class="music-volume" id="music-volume" min="0" max="100" value="70" />
      </div>
      <div class="music-playlist" id="music-playlist"></div>
    </div>
  `;
}

function initMusic(win){
  const audio =new Audio();
  musicAudioRef=audio;

  let tracklist=[];
  let currentIndex=0;

  const dropzone=win.querySelector("#music-dropzone");
  const fileInput=win.querySelector("#music-file-input");
  const vinyl=win.querySelector("#music-vinyl");
  const titleEl=win.querySelector("#music-title");
  const artistEl=win.querySelector("#music-artist");
  const playBtn=win.querySelector("#music-play");
  const progressEl=win.querySelector("#music-progress");
  const currentTimeEl= win.querySelector("#music-current");
  const durationEl =win.querySelector("#music-duration");
  const playlistEl=win.querySelector("#music-playlist");
  const volumeSlider =win.querySelector("#music-volume");

  function formatTime(seconds) {
    const m =Math.floor(seconds / 60);
    const s =Math.floor(seconds % 60);
    return m +":" + s.toString().padStart(2, "0");
  }
  function addFiles(fileList) {
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith("audio/")) return;
      tracklist.push({
        title: file.name.replace(/\.[^/.]+$/, ""),
        src: URL.createObjectURL(file),
      });
    });
    renderPlaylist();
    if (tracklist.length === fileList.length) loadTrack(0);
  }

  function renderPlaylist() {
    playlistEl.innerHTML = "";
    tracklist.forEach((track, i) => {
      const item = document.createElement("div");
      item.className = "music-playlist-item" + (i === currentIndex ? " active" : "");
      item.textContent = track.title;
      item.addEventListener("click", () => { loadTrack(i); play(); });
      playlistEl.appendChild(item);
    });
  }
  function loadTrack(index) {
    if (!tracklist[index]) return;
    currentIndex = index;
    const track = tracklist[index];
    audio.src = track.src;
    titleEl.textContent = track.title;
    artistEl.textContent = `Track ${index + 1} of ${tracklist.length}`;
    progressEl.value = 0;
    currentTimeEl.textContent = "0:00";
    renderPlaylist();
  }
  function play() {
    if (!audio.src) return;
    audio.play();
    playBtn.innerHTML = "&#10074;&#10074;";
    vinyl.classList.add("spinning");
    updateNowPlaying(tracklist[currentIndex].title, true);
  }
  function pause() {
    audio.pause();
    playBtn.innerHTML = "&#9654;";
    vinyl.classList.remove("spinning");
    updateNowPlaying(tracklist[currentIndex].title, false);
  }
  playBtn.addEventListener("click", () => { if (audio.paused) play(); else pause(); });
  win.querySelector("#music-next").addEventListener("click", () => {
    if (tracklist.length === 0) return;
    loadTrack((currentIndex + 1) % tracklist.length);
    play();
  });

  win.querySelector("#music-prev").addEventListener("click", () => {
    if (tracklist.length === 0) return;
    loadTrack((currentIndex - 1 + tracklist.length) % tracklist.length);
    play();
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progressEl.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });
  progressEl.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressEl.value / 100) * audio.duration;
  });
  audio.addEventListener("ended", () => {
    if (tracklist.length === 0) return;
    loadTrack((currentIndex + 1) % tracklist.length);
    play();
  });

  audio.volume = volumeSlider.value / 100;
  volumeSlider.addEventListener("input", () => { audio.volume = volumeSlider.value / 100; });

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => addFiles(fileInput.files));
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("drag-over"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag-over"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    addFiles(e.dataTransfer.files);
  });
}

// paint
function getPaintHTML() {
  return `
    <div class="paint">
      <div class="paint-toolbar">
        <div class="paint-swatches">
          <button class="paint-swatch active" data-color="#efe6d8" style="background:#efe6d8"></button>
          <button class="paint-swatch" data-color="#c9583f" style="background:#c9583f"></button>
          <button class="paint-swatch" data-color="#7a9c81" style="background:#7a9c81"></button>
          <button class="paint-swatch" data-color="#5f93a0" style="background:#5f93a0"></button>
          <button class="paint-swatch" data-color="#d9a441" style="background:#d9a441"></button>
          <span class="paint-divider"></span>
          <label class="paint-custom-color" title="Custom color">
            <input type="color" class="paint-color" id="paint-color" value="#efe6d8" />
          </label>
        </div>
        <div class="paint-tools">
          <button class="paint-tool active" data-tool="pencil" title="Pencil">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/></svg>
          </button>
          <button class="paint-tool" data-tool="line" title="Line">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 19L19 5"/></svg>
          </button>
          <button class="paint-tool" data-tool="rect" title="Box">
            <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14"/></svg>
          </button>
          <button class="paint-tool" data-tool="circle" title="Circle">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"/></svg>
          </button>
        </div>
        <input type="range" class="paint-size" id="paint-size" min="1" max="30" value="4" />
        <button class="paint-btn" id="paint-undo" title="Undo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/></svg>
        </button>
        <button class="paint-btn" id="paint-clear" title="Clear">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>
        </button>
      </div>
      <canvas class="paint-canvas" id="paint-canvas"></canvas>
    </div>
  `;
}

function initPaint(win) {
  const canvas=win.querySelector("#paint-canvas");
  const ctx=canvas.getContext("2d");
  const colorPicker=win.querySelector("#paint-color");
  const sizePicker=win.querySelector("#paint-size");
  const clearBtn=win.querySelector("#paint-clear");
  const undoBtn=win.querySelector("#paint-undo");

  let currentColor=colorPicker.value;
  let currentTool="pencil";
  let isDrawing=false;
  let startX=0, startY = 0, lastX = 0, lastY = 0;

  let undoStack=[];
  const MAX_UNDO=20;
  function saveUndoSnapshot() {
    undoStack.push(canvas.toDataURL());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }
  function paintBackground() {
    ctx.fillStyle = "#1f1a16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const savedImage = canvas.width > 0 ? canvas.toDataURL() : null;
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintBackground();
    if (savedImage) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = savedImage;
    }
  }
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function drawShape(x, y) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = sizePicker.value;
    ctx.lineCap = "round";
    if (currentTool === "line") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    if (currentTool === "rect") {
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    }
    if (currentTool === "circle") {
      const radius = Math.hypot(x - startX, y - startY);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    startX = pos.x; startY = pos.y; lastX = pos.x; lastY = pos.y;
    saveUndoSnapshot();
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    if (currentTool === "pencil") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = sizePicker.value;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastX = pos.x; lastY = pos.y;
    } else {
      const snapshot = undoStack[undoStack.length - 1];
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        drawShape(pos.x, pos.y);
      };
      img.src = snapshot;
    }
  }

  function stopDraw() {
    if (isDrawing) savePaintState();
    isDrawing = false;
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  win.querySelectorAll(".paint-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      win.querySelectorAll(".paint-swatch").forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
      currentColor = swatch.dataset.color;
      colorPicker.value = swatch.dataset.color;
    });
  });
  colorPicker.addEventListener("input", () => {
    win.querySelectorAll(".paint-swatch").forEach((s) => s.classList.remove("active"));
    currentColor = colorPicker.value;
  });

  win.querySelectorAll(".paint-tool").forEach((btn) => {
    btn.addEventListener("click", () => {
      win.querySelectorAll(".paint-tool").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTool = btn.dataset.tool;
    });
  });

  undoBtn.addEventListener("click", () => {
    if (undoStack.length === 0) return;
    const previous = undoStack.pop();
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      savePaintState();
    };
    img.src = previous;
  });

  clearBtn.addEventListener("click", () => {
    saveUndoSnapshot();
    paintBackground();
    savePaintState();
  });

  setTimeout(() => { resizeCanvas(); loadSavedDrawing(); }, 0);
  win.paintResize = resizeCanvas;

  function loadSavedDrawing() {
    const saved = loadFromStorage("nebula-paint", null);
    if (!saved) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = saved;
  }
  function savePaintState() {
    saveToStorage("nebula-paint", canvas.toDataURL());
  }
}

// Snake
function getSnakeHTML() {
  return `
    <div class="snake-game">
      <div class="snake-header">
        <div class="snake-stats">
          <span class="snake-score" id="snake-score">Score: 0</span>
          <span class="snake-best" id="snake-best">Best: 0</span>
        </div>
        <button class="snake-restart" id="snake-restart">Restart</button>
      </div>
      <canvas class="snake-canvas" id="snake-canvas"></canvas>
      <div class="snake-hint">Use arrow keys — click the game first</div>
    </div>
  `;
}

function initSnake(win) {
  const canvas = win.querySelector("#snake-canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = win.querySelector("#snake-score");
  const bestEl = win.querySelector("#snake-best");
  const restartBtn = win.querySelector("#snake-restart");
  const CELL = 18;
  const GRID = 20;
  canvas.width = CELL * GRID;
  canvas.height = CELL * GRID;

  let snake, direction, nextDirection, food, score, gameOver, loopId;
  let bestScore = loadFromStorage("nebula-snake-best", 0);

  function resetGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    score = 0;
    gameOver = false;
    scoreEl.textContent = "Score: 0";
    bestEl.textContent = "Best: " + bestScore;
    placeFood();
    draw();
  }
  function placeFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some((seg)=>seg.x===pos.x && seg.y === pos.y));
    food = pos;
  }
  function drawGrid() {
    ctx.strokeStyle="#2a231d";
    ctx.lineWidth=1;
    for (let i=0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i *CELL, 0);
      ctx.lineTo(i *CELL, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0,i * CELL);
      ctx.lineTo(canvas.width, i * CELL);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.fillStyle ="#1f1a16";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawGrid();
    const foodCenterX=food.x * CELL + CELL / 2;
    const foodCenterY=food.y * CELL + CELL / 2;
    ctx.fillStyle="#e0704f";
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, (CELL - 4) / 2, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#a8e6a1" : "#4f9d57";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });

    const head = snake[0];
    const hx = head.x * CELL;
    const hy = head.y * CELL;
    ctx.fillStyle = "#0d0b09";
    let eye1, eye2;
    if (direction.x===1) {eye1 =[hx + CELL * 0.65, hy + CELL * 0.3]; eye2=[hx + CELL * 0.65,hy +CELL * 0.7]; }
    else if (direction.x === -1) {eye1=[hx +CELL* 0.35,hy + CELL*0.3];eye2 =[hx+ CELL*0.35, hy + CELL * 0.7]; }
    else if (direction.y === -1) {eye1 = [hx + CELL * 0.3, hy + CELL * 0.35]; eye2 = [hx + CELL * 0.7, hy + CELL * 0.35]; }
    else { eye1 = [hx + CELL * 0.3,hy + CELL * 0.65]; eye2 = [hx + CELL * 0.7, hy + CELL * 0.65]; }

    ctx.beginPath();
    ctx.arc(eye1[0], eye1[1], 1.6, 0, Math.PI * 2);
    ctx.arc(eye2[0], eye2[1], 1.6, 0, Math.PI * 2);
    ctx.fill();

    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#efe6d8";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    }
  }

  function tickGame() {
    if (gameOver) return;
    direction = nextDirection;
    const head = {
      x: (snake[0].x + direction.x + GRID) % GRID,
      y: (snake[0].y + direction.y + GRID) % GRID,
    };
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOver = true;
      draw();
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = "Score: " + score;
      if (score > bestScore) {
        bestScore = score;
        bestEl.textContent = "Best: " + bestScore;
        saveToStorage("nebula-snake-best", bestScore);
      }
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function handleKeydown(e) {
    if (!win.classList.contains("active")) return;
    const keyMap = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
    };
    const newDir = keyMap[e.key];
    if (!newDir) return;
    e.preventDefault();
    const isOpposite = newDir.x === -direction.x && newDir.y === -direction.y;
    if (!isOpposite) nextDirection = newDir;
  }
  document.addEventListener("keydown", handleKeydown);
  restartBtn.addEventListener("click", resetGame);
  loopId = setInterval(tickGame, 130);
  resetGame();
  win.snakeCleanup = () => {
    clearInterval(loopId);
    document.removeEventListener("keydown", handleKeydown);
  };
}

// TODO widget
function initTodoWidget() {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("todo-add");
  const list = document.getElementById("todo-list");
  let tasks = loadFromStorage("nebula-tasks", []);

  function render() {
    list.innerHTML = "";
    tasks.forEach((task) => {
      const row = document.createElement("div");
      row.className = "todo-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveToStorage("nebula-tasks", tasks);
        render();
      });

      const label = document.createElement("span");
      label.textContent = task.text;
      if (task.done) label.classList.add("todo-done");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "todo-delete";
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveToStorage("nebula-tasks", tasks);
        render();
      });
      row.appendChild(checkbox);
      row.appendChild(label);
      row.appendChild(deleteBtn);
      list.appendChild(row);
    });
  }

  function addTask() {
    const text = input.value.trim();
    if (text === "") return;
    tasks.push({ id: Date.now(), text: text, done: false });
    saveToStorage("nebula-tasks", tasks);
    input.value = "";
    render();
  }
  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") addTask(); });
  render();
}

// Hydration widget
function initHydrationWidget() {
  const countEl = document.getElementById("hydration-count");
  const barFill = document.getElementById("hydration-bar-fill");
  const minusBtn = document.getElementById("hydration-minus");
  const plusBtn = document.getElementById("hydration-plus");

  const GOAL = 8;
  let cups = loadFromStorage("nebula-hydration", 0);
  function render() {
    countEl.textContent = cups + " / " + GOAL + " cups";
    const percent = Math.min((cups/GOAL) * 100, 100);
    barFill.style.width = percent+ "%";
  }
  plusBtn.addEventListener("click",()=>{cups++;saveToStorage("nebula-hydration", cups); render(); });
  minusBtn.addEventListener("click",()=>{if(cups>0) cups--; saveToStorage("nebula-hydration", cups); render(); });
  render();
}
initTodoWidget();
initHydrationWidget();

// context menu

function initContextMenu() {
  const menu = document.getElementById("context-menu");
  const desktop = document.getElementById("desktop");
  const wallpaperInput = document.getElementById("wallpaper-input");

  desktop.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.style.display = "flex";
  });
  document.addEventListener("click", () => { menu.style.display = "none"; });
  menu.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action=btn.dataset.action;
      if (action==="refresh") location.reload();
      if (action==="arrange") arrangeWindows();
      if (action==="wallpaper") wallpaperInput.click();
    });
  });
  wallpaperInput.addEventListener("change", () => {
    const file = wallpaperInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement("canvas");
        const MAX_WIDTH = 1600;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        tempCanvas.width = img.width * scale;
        tempCanvas.height = img.height * scale;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        const compressed = tempCanvas.toDataURL("image/jpeg", 0.7);
        desktop.style.backgroundImage = `url(${compressed})`;
        desktop.style.backgroundSize = "cover";
        desktop.style.backgroundPosition = "center";
        try {
          saveToStorage("nebula-wallpaper", compressed);
        } catch (err) {
          console.log("Wallpaper too large to save — will reset on reload.");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  const savedWallpaper=loadFromStorage("nebula-wallpaper", null);
  if (savedWallpaper){
    desktop.style.backgroundImage=`url(${savedWallpaper})`;
    desktop.style.backgroundSize="cover";
    desktop.style.backgroundPosition="center";
  }
}
function arrangeWindows(){
  const cols=3;
  const startX=60, startY = 60, gapX = 420, gapY = 300;
  let i=0;
  Object.values(openWindows).forEach((win) => {
    if (win.classList.contains("maximized")) return;
    const col = i % cols;
    const row = Math.floor(i / cols);
    win.style.left = (startX + col * gapX) + "px";
    win.style.top = (startY + row * gapY) + "px";
    i++;
  });
}

function updateDockAutohide() {
  const dockEl = document.querySelector(".dock");
  const desktop = document.getElementById("desktop");
  const anyMaximized = Object.values(openWindows).some((w) => w.classList.contains("maximized"));
  desktop.classList.toggle("dock-autohide", anyMaximized);
}
document.getElementById("dock-trigger").addEventListener("mouseenter", () => {
  document.querySelector(".dock").classList.add("dock-peek");
});

document.querySelector(".dock").addEventListener("mouseleave", () => {
  document.querySelector(".dock").classList.remove("dock-peek");
});
initContextMenu();


