const colors = {
  blue: "#343BAA",
  blueDark:"#1F1172",
  pinkLight:" #F0BEFF",
  pink:"#FF00BA"
};


// init canvas setting
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const radius = 270; // wheel radius
const PI = Math.PI;
const PI2 = Math.PI*2;

canvas.width = radius * 2;
canvas.height = radius * 2;

// draw sectors
ctx.fillPie = function(x,y,r,start){
  let angle = PI / 4;
  this.beginPath()
  ctx.lineTo(radius, radius)
  this.arc(x,y,r,start*angle,(start+1)*angle)
  ctx.lineTo(radius,radius)
  this.fill()
};

const iconGroup = document.querySelector(".icon-group");

function insertContent(data,qty){
  let rotate = 360 / qty
  data.forEach((item,index)=>{
    let html = `
    <i class="${item.icon}"></i>
    <h5>${item.text}</h5>
    <span>${item.num}</span>
    `
    let newContent = document.createElement("li")
    newContent.innerHTML = html
    iconGroup.append(newContent)
    newContent.style.transform = `rotate(${index*rotate}deg)` 
  })
};

export default function draw(data,qty){
  for(let i = 0 ; i<=8 ; i+=2){
    ctx.fillStyle = colors.pinkLight;
    ctx.fillPie(radius,radius,radius,i);
  }
  for(let i = 1 ; i<=8 ; i+=2){
    ctx.fillStyle = colors.blue;
    ctx.fillPie(radius,radius,radius,i);
  }
    // draw press button
    ctx.beginPath()
    ctx.fillStyle = colors.blueDark;
    ctx.translate(radius,radius);
    ctx.arc(0,0,55,0,PI2);
    ctx.fill();
    insertContent(data,qty)
};