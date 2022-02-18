// <!-- 員工20人, 獎品8個 -->

// <!-- 員工150人, 獎品20個  -->
// <!-- 放上編號就好 -->
import {draw,drawSelected,drawSectors} from "./draw.js"
let data = [];
let game = null;
const playTimes = {
  "2021":20,
  "2022":150
};

const wheel = document.querySelector("#wheel")
const pointer = document.querySelector(".pointer");
const pressBtn = document.querySelector(".pointer span");
const banner = document.querySelector(".banner");
const infoText = document.querySelector(".info-text");
const selectedPresent = document.querySelector("#selected-present");
const btn_2021 = document.querySelector("#btn-2021");
const btn_2022 = document.querySelector("#btn-2022");
const btn_reset = document.querySelector("#btn-reset");

async function fetchData(url){
  let resp = await fetch(url)
  data = await resp.json()
};
function reset(){
  banner.style.display = 'none'
  pointer.style.transform = 'rotate(0deg)'
};

async function init(val,year){
  await fetchData(val);
  draw(data,data.length,year);
  game = new Game(year,data,playTimes[year],data.length)
};
init("./data_2021.json",2021);


// Event Listners
pressBtn.addEventListener("click",()=>{
  game.spinWheel()
  game.isTurning = true // prevent clicking before it stop
  btn_2021.disabled = true
  btn_2022.disabled = true
  btn_reset.disabled = true
});

pointer.addEventListener("transitionend",()=>{
  btn_2021.disabled = false
  btn_2022.disabled = false
  btn_reset.disabled = false
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
  reset()
  pointer.style.transform = 'rotate(0deg)'
  init(`./data_${btn_2021.value}.json`,btn_2021.value);
  wheel.classList.remove("new")

})
btn_2022.addEventListener("click",()=>{
  reset()
  pointer.style.transform = 'rotate(0deg)'
  init(`./data_${btn_2022.value}.json`,btn_2022.value);
  wheel.classList.add("new")

})

btn_reset.addEventListener("click",()=>{
  reset()
  let currentYear = game.year
  currentYear==2021 ? btn_2021.click() : btn_2022.click()
})

// Init Game object
const Game = function(year,dataBase,times,presentQty){
  this.year = year
  this.pool = [...dataBase]
  this.playTimes = times
  this.presentQty = presentQty // define the num of sectors
  this.isTurning = false
  this.isEnd = false
  this.currentResult = {
    index:null,
    label:null
  }
}

// spin the wheel
Game.prototype.spinWheel = function(){
  if(this.isEnd || this.isTurning) return    // no spinning

  this.getPresent()
  let index = data.findIndex(x=>x.label===`${this.currentResult.label}`)
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
  selectedPresent.innerText = this.currentResult.label
  if(this.isEnd){
    infoText.innerText = 'The End'
    return
  }
  infoText.innerText = 'well done!'
};

Game.prototype.getPresent = function(){
  let index = Math.floor(Math.random()*this.pool.length)
  this.currentResult.label = this.pool[index].label
  this.currentResult.index = index

  // delete present fram present pool if the num is 0
  this.pool[index].num --
  if(this.pool[index].num === 0) {
    this.pool.splice(index,1)
  }
};