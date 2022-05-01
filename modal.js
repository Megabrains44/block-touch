const infoBtn = document.getElementById("info-btn");
const modalBG = document.getElementById("modal-bg");
const xButton = document.querySelector("#modal .x-btn")
infoBtn.addEventListener("click", e => {
    modalBG.classList.toggle('bg-hide')
})

xButton.addEventListener("click", e => {
    modalBG.classList.toggle('bg-hide')
})