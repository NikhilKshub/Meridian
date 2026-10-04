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