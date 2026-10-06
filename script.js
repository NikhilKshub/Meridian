let draggedWindow = null;
let offsetX = 0;
let offsetY = 0;
let zIndex = 1;
let drawing = false;
let strokes = [];
let currentStroke = [];
let glasses = 0;
const goal = 8;

const clock = document.querySelector(".clock");
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleString();
}
updateClock();
setInterval(updateClock, 1000);

const launchers = document.querySelectorAll(".icons button");
for (const button of launchers) {
    button.addEventListener("click", function () {
        const win = document.getElementById(button.dataset.window);
        win.classList.remove("hidden");
        bringToFront(win);
    });
}

const closeButtons = document.querySelectorAll(".titlebar button");
for (const button of closeButtons) {
    button.addEventListener("click", function () {
        const win = button.closest(".window");
        win.classList.add("hidden");
    });
}

const titlebars = document.querySelectorAll(".titlebar");
for (const titlebar of titlebars) {
    titlebar.addEventListener("mousedown", function (event) {
        const win = titlebar.closest(".window");
        draggedWindow = win;
        offsetX = event.clientX - win.offsetLeft;
        offsetY = event.clientY - win.offsetTop;
    });
}

document.addEventListener("mousemove", function (event) {
    if (draggedWindow) {
        draggedWindow.style.left = event.clientX - offsetX + "px";
        draggedWindow.style.top = event.clientY - offsetY + "px";
    }
});

document.addEventListener("mouseup", function () {
    draggedWindow = null;
    drawing = false;
});

function bringToFront(win) {
    zIndex += 1;
    win.style.zIndex = zIndex;
}

const windows = document.querySelectorAll(".window");
for (const win of windows) {
    win.addEventListener("mousedown", function () {
        bringToFront(win);
    });
}


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "#9c2f22";
ctx.lineWidth=2;
ctx.lineCap="round";

function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const stroke of strokes){
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for(const point of stroke){
            ctx.lineTo(point.x,point.y);
        }
        ctx.stroke();
    }
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click",function(){
    strokes=[];
    redraw();
});

const undoButton = document.getElementById("undo");
undoButton.addEventListener("click", function(){
    strokes.pop();
    redraw();
});

canvas.addEventListener("mousedown", function(event){
    drawing=true;
    currentStroke = [];
    strokes.push(currentStroke);
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    currentStroke.push({x:x, y:y});
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,y);
    ctx.stroke();
});

canvas.addEventListener("mousemove", function(event){
    if(drawing){
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        currentStroke.push({x:x, y:y});
        ctx.lineTo(x,y);
        ctx.stroke();
    }
});

const count = document.getElementById("count");
const fill = document.querySelector(".fill");
function showWater(){
    count.textContent = glasses;
    fill.style.width = (glasses / goal * 100) + "%";
}

const drinkButton = document.getElementById("drink");
drinkButton.addEventListener("click",function(){
    if(glasses < goal){
        glasses = glasses + 1;
    }
    showWater();
});

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click",function(){
    glasses = 0;
    showWater();
});



// WEBOS 2.0 STARTING FROM HERE
let selectedBox=null;
const entries = JSON.parse(localStorage.getItem("entries")) ||{};
function save(){
    localStorage.setItem("entries",JSON.stringify(entries));
}






const weekdays=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const moods = [
    {name: "happy", emoji: "😊", color: "#F6D77A" },
    {name: "calm", emoji: "😌", color: "#B8D8C0" },
    {name: "sad", emoji: "😔", color: "#B9C7E6" },
    {name: "angry", emoji: "😠", color: "#E8A39A" },
    {name: "tired", emoji: "😴", color: "#C9B8D9" },
    {name: "excited", emoji: "🤩", color: "#F2B880" },
    {name: "something is missing", emoji:"🥺", color:"#D3D3D3"}
];

const days=document.getElementById("days");
const moodsBox=document.getElementById("moods");
const note = document.querySelector(".note");
const noteTitle = document.getElementById("note-title");
const noteText = document.getElementById("note-text");
const todayIndex = (new Date().getDay() +6) % 7;

for(let i =0; i<weekdays.length; i++){
    const box = document.createElement("button");
    box.classList.add("day");
    box.textContent = weekdays[i];
    const date=new Date();
    data.setDate(date.getDate() - todayIndex +1);
    const key= date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    box.dataset.key=key;

    if(i === todayIndex){
        box.classList.add("today");
    }
    if(i>todayIndex){
        box.disabled = true;
    }
    days.appendChild(box);
}

for( const mood of moods){
    const button = document.createElement("button");
    button.textContent = mood.emoji;
    button.title = mood.name;
    button.setAttribute("aria-label", mood.name);
    moodsBox.appendChild(button);
}

function render(){
    for(let i=0; i<days.children.length; 1++){
        const box=days.children[i];
        const entry = entries[box.dataset.key];
        box.textContent=weekdays[i];
        box.style.backgroundColor = "";
        if(entry){
            const mood = moods.find(function(m){
                return m.name === entry.mood;
            });
            box.textContent = weekdays[i] + "\n" + mood.emoji;
            box.style.backgroundColor=mood.color;
        }
        box.classList.toggle("selected", box === selectedBox);
    }
}

