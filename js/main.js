// <!-- 員工20人, 獎品8個 -->

// <!-- 員工150人, 獎品20個  -->
// <!-- 放上編號就好 -->
import draw from "./draw.js"
let data = [];
let game = null;

const pointer = document.querySelector(".pointer");
const pressBtn = document.querySelector(".pointer span");
const banner = document.querySelector(".banner");
const infoText = document.querySelector(".info-text");
const selectedPresent = document.querySelector("#selected-present");
const btn_2021 = document.querySelector("#btn-2021");
const btn_2022 = document.querySelector("#btn-2022");
async function fetchData(url){
  let resp = await fetch(url)
  data = await resp.json()
};

async function init(val){
  await fetchData(val);
  draw(data,data.length);
  game = new Game(data,20,data.length)
};
init("../data_2021.json");

// Event Listners
pressBtn.addEventListener("click",()=>{
  console.log(data)
  game.spinWheel()
  game.isTurning = true // prevent clicking before it stop
  
});

pointer.addEventListener("transitionend",()=>{
  pointer.style.transition = 'none';
  let actualDeg = (game.deg-3600);
  game.deg = actualDeg;
  pointer.style.transform = `rotate(${actualDeg}deg)`
  game.isTurning = false
  game.renderNum()
  game.playTimes--
  if(game.playTimes === 0){
    game.isEnd = true
  }
  game.showResult()
});

btn_2021.addEventListener("click",()=>{
  console.log('2021')
  init("../data_2021.json");

})
btn_2022.addEventListener("click",()=>{
  console.log('2022')
  // init("../data_2022.json");
})


// Init Game object
const Game = function(dataBase,times,presentQty){
  this.pool = [...dataBase]
  this.playTimes = times
  this.presentQty = presentQty // define the num of sectors
  this.isTurning = false
  this.isEnd = false
  this.currentResult = ''
}

// spin the wheel
Game.prototype.spinWheel = function(){
  if(this.isEnd || this.isTurning) return    // no spinning

  this.getPresent()
  let index = data.findIndex(x=>x.text===`${this.currentResult}`)
  this.deg = index*360 / this.presentQty+3600

  banner.style.display = 'none'
  pointer.style.transform = `rotate(${this.deg}deg)`
  pointer.style.transition = 'all 3s ease-out'

};

// re-rendering num in present pool
Game.prototype.renderNum = function(){
  document.querySelectorAll(".icon-group span").forEach((item,index)=>{    
    item.innerText = data[index].num
  })
};

Game.prototype.showResult = function(){
  banner.style.display = 'flex'
  selectedPresent.innerText = this.currentResult
  if(this.isEnd){
    infoText.innerText = 'The End'
    return
  }
  infoText.innerText = 'Congrats!'
}

Game.prototype.getPresent = function(){
  let num = Math.floor(Math.random()*this.pool.length)
  this.currentResult = this.pool[num].text

  // delete present fram present pool if the num is 0
  this.pool[num].num --

  if(this.pool[num].num === 0) {
    this.pool.splice(num,1)
  }
}