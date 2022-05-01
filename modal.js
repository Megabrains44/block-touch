const infoBtn = document.getElementById("info-btn");
const modalBG = document.getElementById("modal-bg");
const xButton = document.querySelector("#modal .x-btn")
infoBtn.addEventListener("click", e => {
    modalBG.style.visibility = "visible";
    modalBG.style.opacity = "1";
})

xButton.addEventListener("click", e => {
    modalBG.style.visibility = "hidden";
    modalBG.style.opacity = "0";
})