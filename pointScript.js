function startGame(){const canvas = document.getElementById("canvas");
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

const BASE_LIMITER = 20;

let y = 0;
let frames = 0;
// let FRAME_LIMITER = 10;
let FRAME_LIMITER = BASE_LIMITER;
                     
const CELL_WIDTH = 50;
let fake_FRAME_LIMITER = FRAME_LIMITER;
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
function drawGrid(){
  for (let i = 0; i < blocks[0].length; i++){
    for (let j = 0; j < blocks.length; j++){
      c.strokeStyle = "#e1ebf5";
      c.beginPath()
      c.moveTo((i + 1) * 50, j * 50);
      c.lineTo((i + 1) * 50, (j + 1) * 50);
      c.stroke()
      c.beginPath()
      c.moveTo((i + 1) * 50, (j + 1) * 50);
      c.lineTo((i) * 50, (j + 1) * 50);
      c.stroke()
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
const middle = Math.round(canvas.width / (2 * CELL_WIDTH)) - 1;
let playerCords = new Coordinate(middle,0);
const colors = [
  "blue",
  "red",
  "pink",
  "green",

  // "#f54e4e",
  // "#cc1818",
  // "#87cc18",
  // "#5a8a0c"
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
  //const middle = Math.round(canvas.width / (2 * CELL_WIDTH)) - 1;
  
  playerCords = new Coordinate(middle,0)
  
  playerProperties = {
    width: 2,
    height: 2
  }
  
    
  isPlayerFixed = false;
  
  currentColor = colors[Math.floor(Math.random() * colors.length)];
}

function addPlayerCords(){
  
    // console.log("X value", playerCords.x)
    // console.log("Y value", playerCords.y)
    // blocks[playerCords.y][playerCords.x].filled = true;
    // blocks[playerCords.y][playerCords.x].color = currentColor;
  
  let idxes = getIdxFor(playerCords.x, playerCords.y);

  console.log(idxes[0] === -1);
  console.log("X:" + playerCords.x);
  console.log("Y:" + playerCords.y)
  blocks[idxes[0]][idxes[1]].filled = true;
  blocks[idxes[0]][idxes[1]].color = currentColor;
  
  
  // push cell cords to blocks arr so its fixed 
}
let stopAnimate = true;
let hasStarted = false;
let status = "Play!";
let score = 0;


function addLocalStorage(){
  const prevNumber = localStorage.getItem("pointHighScore");
  if (!prevNumber) localStorage.setItem("pointHighScore", score);
  else {
    if (score > parseInt(prevNumber)){
      localStorage.setItem("pointHighScore", score);
    }
  }
}

function breakBlocks(){
  
  let idxFound = null;
  for (let i = 0; i < blocks.length; i++){
    let isAllFilled = true;
    const row = blocks[i];
    
    row.forEach(block => {
      if (!block.filled) isAllFilled = false;
    })
    if (isAllFilled){
      idxFound = i;
      break;
    }
    
    
  }
  if (idxFound){
      // blocks[i]
    // console.log(idxFound)
    for (let i =0; i < blocks[idxFound].length; i++){
      blocks[idxFound][i] = new Piece(i, idxFound);
    }
    for (let i = 0; i < blocks.length; i++){
      for (let j = 0; j < blocks[0].length; j++){
        blocks[i][j].y++;
      }
    }
      
  }
}

function animate(){
  
  c.clearRect(0,0,canvas.width, canvas.height);
  drawGrid()
  const defColor = "black" 
  c.fillStyle = hasStarted ? (stopAnimate ? "red" : defColor) : defColor;
  c.textAlign = "center";
  c.font = "34px Arial"
  c.textBaseline = "top"
  c.fillText(status, canvas.width / 2, 20);
  c.fillStyle = defColor;
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
      updatePlayer();
      
      if (checkLose()) {
        stopAnimate = true;
        status = "You lost!"
        // localStorage
        addLocalStorage()
        return;
      };
      breakBlocks()
      score++;
      fake_FRAME_LIMITER *= 0.99;
      if (Math.round(fake_FRAME_LIMITER) != FRAME_LIMITER){
        FRAME_LIMITER = Math.round(fake_FRAME_LIMITER);
        console.log(FRAME_LIMITER)
      }
      
        
        
      
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
        breakBlocks()
        score++;
        fake_FRAME_LIMITER *= 0.99;
        if (Math.round(fake_FRAME_LIMITER) != FRAME_LIMITER){
          FRAME_LIMITER = Math.round(fake_FRAME_LIMITER);
          console.log(FRAME_LIMITER)
        }
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


function getMostBottomBlock(x,y, steps){
  if (y + 1 > (canvas.height / CELL_WIDTH)){
    return [-1, -1];
  }
  const bottomBlocks = blocks.flat().filter(block => block.filled && block.y == y+2 && block.x == x);
  if (bottomBlocks.length > 0 || (y + 2 == (canvas.height / CELL_WIDTH))){
    // bottom piece
    return [x,y, steps];
  } else {
    
    return getMostBottomBlock(x, y + 1, steps + 1);
  }
}

                     
window.addEventListener("keydown", e => {
  if (stopAnimate) return;
  if (e.code == "ArrowRight" || e.code === "KeyD"){
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
  else if (e.code == "ArrowLeft" || e.code === "KeyA"){
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
  else if (e.code == "ArrowDown"  || e.code === "KeyS"){
    console.log('arow down')
    const [i1, i2, steps] = getMostBottomBlock(playerCords.x, playerCords.y, 0);
    // console.log(i1, )
    if (i2 > -1){
      console.log(steps)
      playerCords.y += steps;
      console.log(playerCords.y);
      
      console.log("thing")
    }
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
  FRAME_LIMITER = BASE_LIMITER;
  fake_FRAME_LIMITER = BASE_LIMITER;
})
window.addEventListener("keyup", e => {
  if (e.code === "KeyR"){
    status = "Play!"
    addEmptyBlocks();
    updatePlayer();
    score = 0;
    hasStarted = true;
    stopAnimate = false;
  }
})

          

animate()}

export {startGame}