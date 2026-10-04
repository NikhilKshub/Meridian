let draggedWindow = null;
let offsetX = 0;
let offsetY = 0;

const clock = document.querySelector(".clock");
function updateClock(){
    const now = new Date();
    clock.textContent = now.toLocaleString();
}
updateClock();
setInterval(updateClock,1000);

const launchers = document.querySelectorAll(".icons button");
for (const button of launchers){
    button.addEventListener("click",function(){
        const win = document.getElementById(button.dataset.window);
        win.classList.remove("hidden");
    });
}

const closeButtons = document.querySelectorAll(".titlebar button");
for(const button of closeButtons){
    button.addEventListener("click",function(){
        const win = button.closest(".window");
        win.classList.add("hidden");
    });
}
