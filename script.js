import {startGame as fillGame} from "./fillScript.js";
import {startGame as pointGame} from "./pointScript.js";

const fillButton = document.getElementById("gamemode-fill")
const pointButton = document.getElementById("gamemode-points")
const menuElement = document.querySelector(".menu")
const mainFrame = document.querySelector(".main-frame")

let gameMode;


fillButton.addEventListener("click", e => {
  menuElement.style.display = "none";
  mainFrame.style.display = "flex";
  gameMode = "fill";
  fillGame()
})

pointButton.addEventListener("click", e => {
  menuElement.style.display = "none";
  mainFrame.style.display = "flex";
  gameMode = "point";
  pointGame()
})