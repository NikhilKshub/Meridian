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

// desktop quote widget
function initDesktopQuote() {
  const el = document.getElementById("desktop-quote");
  if (!el) return;
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  el.textContent = `"${quote.text}" — ${quote.from}`;
}
initDesktopQuote();

// window management
const apps = {
  notes:{title:"Notes" },
  calculator:{title: "Calculator", width: 300, height: 380 },
};

let openWindows = {};
let topZIndex = 10;
let windowCount = 0;

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
  if (appName ==="notes") initNotes(win);
  bringToFront(win);
}

function closeWindow(appName){
  const win = openWindows[appName];
  if (!win) return;
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
  win.querySelectorAll(".notes-tool").forEach((btn) => {
    btn.addEventListener("click",()=>{
      document.execCommand(btn.dataset.cmd);
      textarea.focus();
    });
  });
}

function updateDockAutohide() {
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