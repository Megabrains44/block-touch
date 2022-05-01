const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
// canvas.width = (window.innerWidth) - (window.innerWidth % 25); // added
// canvas.height = (window.innerHeight) - (window.innerHeight % 25); // added

class Piece{
  constructor(x,y,color = "black", isBottom = null){
    this.filled = false;
    this.color = color;
    this.isBottom = isBottom;
    this.x = x;
    this.y = y;
  }

  
}



let y = 0;
let frames = 0;
const FRAME_LIMITER = 10;
const CELL_WIDTH = 50;

// @type {Piece[][]}
let blocks = [];


function addEmptyBlocks(){

  for (let i = 0; i < canvas.height / CELL_WIDTH; i++){
    blocks[i] = [];
    for (let j = 0; j < canvas.width / CELL_WIDTH; j++){
  
      blocks[i][j] = new Piece(j, i);
      
    }
  }
}
addEmptyBlocks()
class Coordinate{
  constructor(x,y, isBottom = true){
    this.x = x;
    this.y = y;
    this.isBottom = isBottom;
  }
  realY(){
    return this.y * CELL_WIDTH;
  }
  realX(){
    return this.x * CELL_WIDTH;
  }
  
  
}

/*
[][][]
  []
*/

let playerProperties = {
  width: 2,
  height: 2
}
let playerCords = new Coordinate(0,0);
const colors = [
  "blue",
  "red",
  "orange",
  "yellow"
]
let isPlayerFixed = false;
let currentColor = colors[Math.floor(Math.random() * colors.length)];


function getIdxFor(x, y){
  for (let i = 0; i < blocks.length; i++){
    for (let j = 0; j < blocks[i].length; j++){
      if (blocks[i][j].x == x && blocks[i][j].y == y){
        return [i,j]
      }
    }
  }
  return [-1, -1]
}



function checkLose(){
  // rows
  for (let i = 0; i < blocks.length; i++){
    for (let j = 0; j < blocks[i].length - 1; j++){
      const firstBlock = blocks[i][j];
      const secondBlock = blocks[i][j+1];
      if (firstBlock.filled && secondBlock.filled){
        if (firstBlock.color == secondBlock.color){
          return true;
        }
      }
    }
  }
  for (let i = 0; i < blocks[0].length; i++){
    for (let j = 0; j < blocks.length - 1; j++){
      const firstBlock = blocks[j][i];
      const secondBlock = blocks[j+1][i];
      if (firstBlock.filled && secondBlock.filled){
        if (firstBlock.color == secondBlock.color){
          return true;
        }
      }
    }
  }
  return false;
}

function updatePlayer(){

  // playerCords = [
  //   new Coordinate(0,0),
  //   new Coordinate(1,0, false),
  //   new Coordinate(2,0),
  //   new Coordinate(1,1)
  // ];
  
  playerCords = new Coordinate(0,0)
  
  playerProperties = {
    width: 2,
    height: 2
  }
  
    
  isPlayerFixed = false;
  
  currentColor = colors[Math.floor(Math.random() * colors.length)];
}

function addPlayerCords(){
  
  
  let idxes = getIdxFor(playerCords.x, playerCords.y);
  blocks[idxes[0]][idxes[1]].filled = true;
  blocks[idxes[0]][idxes[1]].color = currentColor;
  
  
  // push cell cords to blocks arr so its fixed 
}
let stopAnimate = true;
let hasStarted = false;
let status = "Play!";
let score = 0;


function addLocalStorage(){
  const prevNumber = localStorage.getItem("highScore");
  if (!prevNumber) localStorage.setItem("highScore", score);
  else {
    if (score > parseInt(prevNumber)){
      localStorage.setItem("highScore", score);
    }
  }
}
function animate(){
  
  c.clearRect(0,0,canvas.width, canvas.height);
  c.fillStyle = hasStarted ? (stopAnimate ? "red" : "black") : "black";
  c.textAlign = "center";
  c.font = "34px Arial"
  c.textBaseline = "top"
  c.fillText(status, canvas.width / 2, 20);
  c.fillStyle = "black";
  c.textAlign = "right";
  c.font = "29px Arial"
  c.textBaseline = "top"
  c.fillText(score + " points", canvas.width - 10, 20);
  if (frames % FRAME_LIMITER === 0){
    if (!isPlayerFixed){
      if (!stopAnimate) playerCords.y++;
      
    }
    // update y values
  };

  let isEnded = false;
  
  
  (function (){
    if (isEnded) return;
    let possibleAreas = blocks
      .flat()
      .filter(block => block.filled)
      .filter(block => block.y - 1 == playerCords.y )
      .filter(block => block.x == playerCords.x)
        
      
    if (possibleAreas.length > 0){
      // reached possible box
      isPlayerFixed = true;
      addPlayerCords()
      
      if (checkLose()) {
        stopAnimate = true;
        status = "You lost!"
        // localStorage
        addLocalStorage()
        return;
      };
      score++;
      
      updatePlayer();
      isEnded = true;
    } 
    else {
      if (playerCords.realY() + CELL_WIDTH == canvas.height){ // reached ground
        isPlayerFixed = true;
        
        addPlayerCords();
        if (checkLose()) {
          stopAnimate = true; 
          status = "You lost!" 
          addLocalStorage()
          return;
        };
        score++;
        updatePlayer()
        
        isEnded = true;
        
      }
    }
    if (!stopAnimate || !hasStarted){
      
    c.fillStyle = currentColor;
    c.shadowColor = currentColor;
    c.shadowBlur = 1;
    c.fillRect(playerCords.x * CELL_WIDTH, playerCords.y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
    }
  })()
  
  // playerCords.forEach(cord => {
  //   if (isEnded) return;
  //   if (cord.isBottom){
      
    
  //     let possibleAreas = blocks
  //       .flat()
  //       .filter(block => block.filled)
  //       .filter(block => block.y - 1 == cord.y )
  //       .filter(block => block.x == cord.x)
        
      
  //     if (possibleAreas.length > 0){
  //       console.log("POSSIBLE BOX")
  //       // reached possible box
  //       isPlayerFixed = true;
  //       addPlayerCords()
  //       updatePlayer();
  //       isEnded = true;
  //     } 
  //     else {
  //       if (cord.realY() + CELL_WIDTH == canvas.height){ // reached ground
  //         isPlayerFixed = true;
          
  //         addPlayerCords();
  //         updatePlayer()
          
  //         isEnded = true;
          
  //       }
  //     }
  //   }


  //   c.fillStyle = currentColor;
  //   c.fillRect(cord.x * CELL_WIDTH, cord.y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
  // })

  blocks.flat().forEach(block => {
    c.fillStyle = block.color; 
    if (block.filled){
      c.shadowColor = block.color;
      c.shadowBlur = 1;
      c.fillRect(block.x * CELL_WIDTH, block.y * CELL_WIDTH, CELL_WIDTH,CELL_WIDTH )
    }
  })

  
  // c.fillStyle = "red";
  // c.fillRect(25,y,25,25);
  frames++;
  
    
  // score = blocks.flat().filter(block => block.filled).length + (stopAnimate ? -1 : 0);
  c.shadowBlur = 0;
  requestAnimationFrame(animate)
}

window.addEventListener("keydown", e => {
  if (stopAnimate) return;
  if (e.code == "ArrowRight"){
    let isValidMove = true;
    
    if (playerCords.x + 1 == (canvas.width / CELL_WIDTH)){
      
      isValidMove = false;
    }
    const rightBlocks = blocks
      .flat()
      .filter(block => block.filled)
      .filter(block => block.x == playerCords.x + 1 && block.y == playerCords.y )
      
    if (rightBlocks.length > 0){
      
      isValidMove = false;
    }
    
    if (isValidMove){
      playerCords.x++;
    }
    
  }
  else if (e.code == "ArrowLeft"){
    let isValidMove = playerCords.x > 0;
    const leftBlocks = blocks
      .flat()
      .filter(block => block.filled)
      .filter(block => block.x == playerCords.x - 1 && block.y == playerCords.y )
    if (leftBlocks.length > 0){
      
      isValidMove = false;
    }
    
    if (isValidMove){
      playerCords.x--;
    }
  }
  else if (e.code == "ArrowUp"){
    
    // rotate
  }
})


playBtn.addEventListener("click", e => {
  if (stopAnimate && !hasStarted){
    stopAnimate = false;
    hasStarted = true;
  }
})
pauseBtn.addEventListener("click", e => {
  if (!stopAnimate && hasStarted){
    stopAnimate = true;
    hasStarted = false;
  }
})
restartBtn.addEventListener("click", e => {
  status = "Play!"
  addEmptyBlocks();
  updatePlayer();
  score = 0;
  hasStarted = true;
  stopAnimate = false;
})

animate()