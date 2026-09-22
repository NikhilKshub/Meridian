function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("status-time").textContent = hours + ":" + minutes;
}

updateClock();
setInterval(updateClock, 1000);

const notesIcon = document.querySelector('[data-app="notes"]');
const notesWindow = document.getElementById("window-notes");

notesIcon.addEventListener("dblclick", () => {
  notesWindow.style.display = "block";
});

notesWindow.querySelector(".window-close").addEventListener("click", () => {
  notesWindow.style.display = "none";
});

const titlebar = notesWindow.querySelector(".window-titlebar");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

titlebar.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - notesWindow.offsetLeft;
  offsetY = e.clientY - notesWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  notesWindow.style.left = (e.clientX - offsetX) + "px";
  notesWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});


