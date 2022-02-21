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
const PI2 = Math.PI*2;
canvas.width = radius * 2;
canvas.height = radius * 2;

// draw sectors
ctx.fillPie = function(x,y,r,start,qty){
  let angle = PI2 / qty;
  this.beginPath()
  ctx.lineTo(radius, radius)
  this.arc(x,y,r,start*angle,(start+1)*angle)
  ctx.lineTo(radius,radius)
  this.fill()
  this.closePath()
};

const iconGroup = document.querySelector(".icon-group");
function insertContent(data,qty,year){
  let rotate = 360 / qty
  iconGroup.innerHTML = ''
    data.forEach((item,index)=>{
      let html = ''
      if(year == 2021){
        html = `
        <i class="icon ${item.icon}"></i>
        <h5>${item.label}</h5>
        <span class="present-qty">${item.num}</span>
        `
      }else{
        html = `
        <h5>${item.label}</h5>
        <span class="present-qty">${item.num}</span>`
      }
      let newContent = document.createElement("li")
      newContent.innerHTML = html
      iconGroup.append(newContent)
      newContent.style.transform = `rotate(${index*rotate}deg)`
    })
};

function drawButton(){
  ctx.beginPath();
  ctx.fillStyle = colors.blueDark;
  ctx.arc(radius,radius,55,0,PI2);
  ctx.closePath();
  ctx.fill();
}

export function drawSectors(qty){
  for(let i = 0 ; i<=qty ; i+=2){
    ctx.fillStyle = colors.pinkLight;
    ctx.fillPie(radius,radius,radius,i,qty);
  }
  for(let i = 1 ; i<=qty ; i+=2){
    ctx.fillStyle = colors.blue;
    ctx.fillPie(radius,radius,radius,i,qty);
  }
}

export function draw(data,qty,year){
  drawSectors(qty)
  
    // draw press button
    drawButton();
    insertContent(data,qty,year);
};

export function drawSelected(i,qty){
  ctx.beginPath();
  ctx.fillStyle = colors.pink;
  ctx.fillPie(radius,radius,radius,i,qty);
  drawButton();
}