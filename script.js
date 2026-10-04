let draggedWindow = null;
let offsetX = 0;
let offsetY = 0;
let zIndex = 1;

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
