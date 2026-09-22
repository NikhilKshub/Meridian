function updateClock() {
  const now=new Date();
  const day=now.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase();
  const date=now.toLocaleDateString(undefined, { month: "short", day: "2-digit" }).toUpperCase();
  const time=now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });

  document.getElementById("boot-day").textContent=day;
  document.getElementById("boot-date").textContent=date;
  document.getElementById("boot-time").textContent=time;
  document.getElementById("status-date").textContent=date;
  document.getElementById("status-time").textContent=time;
}

updateClock();
setInterval(updateClock, 1000);

const quotes = [
  { text: "The flower that blooms in adversity is the rarest of all.", from: "Mulan" },
  { text: "Just keep swimming.", from: "Finding Nemo" },
  { text: "Hakuna Matata — it means no worries.", from: "The Lion King" },
  { text: "To infinity, and beyond!", from: "Toy Story" },
  { text: "You are braver than you believe.", from: "Winnie the Pooh" },
  { text: "Adventure is out there!", from: "Up" }
];

const randomQuote =() =>quotes[Math.floor(Math.random() * quotes.length)];
const bootQuote=randomQuote();
const desktopQuote=randomQuote();
document.getElementById("boot-quote").textContent=`"${bootQuote.text}" — ${bootQuote.from}`;
document.getElementById("desktop-quote").textContent=`"${desktopQuote.text}" — ${desktopQuote.from}`;
requestAnimationFrame(()=>{
  document.getElementById("boot-line").classList.add("grow");
  document.querySelector(".boot-wordmark").classList.add("show");
});

setTimeout(()=>{
  document.getElementById("boot-enter").classList.add("show");
}, 900);
document.getElementById("boot-enter").addEventListener("click", () => {
  const boot=document.getElementById("boot-screen");
  boot.classList.add("boot-hide");
  setTimeout(()=> boot.remove(), 500);
});

function openWindow(win) {
  win.style.display= "block";
  requestAnimationFrame(() => win.classList.add("open"));
}
function closeWindow(win) {
  win.classList.remove("open");
  setTimeout(()=>win.style.display = "none", 150);
}

function makeDraggable(win) {
  const titlebar= win.querySelector(".window-titlebar");
  let dragging=false;
  let offsetX=0;
  let offsetY=0;

  titlebar.addEventListener("mousedown",(e)=>{
    if (e.target.closest(".window-close")) return;
    dragging=true;
    offsetX=e.clientX- win.offsetLeft;
    offsetY=e.clientY- win.offsetTop;
  });
  document.addEventListener("mousemove",(e) => {
    if (!dragging) return;
    win.style.left=`${e.clientX - offsetX}px`;
    win.style.top=`${e.clientY - offsetY}px`;
  });
  document.addEventListener("mouseup", () => {
    dragging=false;
  });
}

const notesIcon=document.querySelector('[data-app="notes"]');
const notesWindow=document.getElementById("window-notes");
notesIcon.addEventListener("click",()=>openWindow(notesWindow));
notesWindow.querySelector(".window-close").addEventListener("click",()=>closeWindow(notesWindow));
makeDraggable(notesWindow);

const calcIcon=document.querySelector('[data-app="calculator"]');
const calcWindow=document.getElementById("window-calculator");
calcIcon.addEventListener("click",()=>openWindow(calcWindow));
calcWindow.querySelector(".window-close").addEventListener("click", () => closeWindow(calcWindow));
makeDraggable(calcWindow);

let calcExpression ="";
const calcDisplay= document.getElementById("calc-display");
document.querySelectorAll("[data-key]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    if (key==="clear") {
      calcExpression="";
    } else if (key==="backspace") {
      calcExpression=calcExpression.slice(0, -1);
    } else if (key ==="=") {
      try {
        calcExpression=String(eval(calcExpression));
      } catch {
        calcExpression="Error";
      }
    } else {
      calcExpression += key;
    }
    calcDisplay.textContent = calcExpression || "0";
  });
});
