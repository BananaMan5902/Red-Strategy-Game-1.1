const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let money = 100
let factories = []
let soldiers = []

let countries = [

{ name:"Russia", owner:"player", troops:25,
points:[[200,200],[350,180],[420,250],[380,330],[240,340],[180,260]],
lake:[300,260,15] },

{ name:"Kazakhstan", owner:"enemy", troops:15,
points:[[380,330],[460,320],[520,370],[470,420],[360,400]],
lake:[430,370,10] },

{ name:"China", owner:"enemy", troops:20,
points:[[520,370],[640,360],[700,430],[620,480],[500,430]] },

{ name:"India", owner:"enemy", troops:15,
points:[[520,480],[620,480],[640,560],[540,580],[480,520]],
lake:[560,520,12] },

{ name:"Europe", owner:"enemy", troops:20,
points:[[200,150],[300,140],[350,180],[200,200],[150,170]] },

{ name:"MiddleEast", owner:"enemy", troops:10,
points:[[350,180],[450,200],[420,260],[320,240]] },

{ name:"Africa", owner:"enemy", troops:18,
points:[[320,240],[420,260],[460,360],[340,380],[260,300]] },

{ name:"Japan", owner:"enemy", troops:8,
points:[[740,320],[780,340],[760,380],[720,350]] },

{ name:"USA", owner:"enemy", troops:20,
points:[[40,200],[140,180],[180,260],[100,300],[40,260]] },

{ name:"Canada", owner:"enemy", troops:12,
points:[[40,120],[140,100],[160,180],[40,200]] },

{ name:"Brazil", owner:"enemy", troops:15,
points:[[120,340],[220,360],[240,450],[160,480],[80,420]],
lake:[170,410,10] }

]

function centerOf(country){
let x=0,y=0
country.points.forEach(p=>{
x+=p[0]
y+=p[1]
})
return {x:x/country.points.length,y:y/country.points.length}
}

function updateUI(){
document.getElementById("money").textContent = Math.floor(money)
document.getElementById("factories").textContent = factories.length
document.getElementById("soldiers").textContent = soldiers.length
}

function buildFactory(){

if(money<50)return

let owned = countries.filter(c=>c.owner==="player")
if(owned.length===0)return

let c = owned[Math.floor(Math.random()*owned.length)]
let center = centerOf(c)

money -= 50

factories.push({
x:center.x + Math.random()*40-20,
y:center.y + Math.random()*40-20,
owner:"player"
})

}

function trainSoldier(){

if(money<10)return

let russia = centerOf(countries[0])

money -= 10

soldiers.push({
x:russia.x,
y:russia.y,
target:null,
owner:"player"
})

}

canvas.addEventListener("click",e=>{

const rect = canvas.getBoundingClientRect()
const mx = e.clientX - rect.left
const my = e.clientY - rect.top

countries.forEach(c=>{

let center = centerOf(c)

let dist = Math.hypot(mx-center.x,my-center.y)

if(dist<60 && c.owner!=="player"){

soldiers.forEach(s=>{
if(s.owner==="player"){
s.target=c
}
})

}

})

})

function drawCountries(){

countries.forEach(c=>{

ctx.beginPath()

ctx.moveTo(c.points[0][0],c.points[0][1])

for(let i=1;i<c.points.length;i++){
ctx.lineTo(c.points[i][0],c.points[i][1])
}

ctx.closePath()

if(c.owner==="player") ctx.fillStyle="#c40000"
else ctx.fillStyle="#444"

ctx.fill()

ctx.strokeStyle="#111"
ctx.lineWidth=2
ctx.stroke()

let center = centerOf(c)

ctx.fillStyle="white"
ctx.font="12px Arial"
ctx.fillText(c.name,center.x-20,center.y)

if(c.lake){
ctx.beginPath()
ctx.arc(c.lake[0],c.lake[1],c.lake[2],0,Math.PI*2)
ctx.fillStyle="#3aa6ff"
ctx.fill()
}

})

}

function drawFactories(){

factories.forEach(f=>{

ctx.fillStyle="#777"
ctx.fillRect(f.x-10,f.y-10,20,20)

ctx.fillStyle="#333"
ctx.fillRect(f.x-3,f.y-18,6,8)

ctx.fillStyle="#aaa"
ctx.fillRect(f.x-8,f.y-5,16,5)

})

}

function drawSoldiers(){

soldiers.forEach(s=>{

ctx.beginPath()
ctx.arc(s.x,s.y,5,0,Math.PI*2)
ctx.fillStyle="#00ff88"
ctx.fill()

ctx.fillStyle="#003322"
ctx.fillRect(s.x-4,s.y-2,8,3)

})

}

function moveSoldiers(){

soldiers.forEach(s=>{

if(!s.target) return

let center = centerOf(s.target)

let dx = center.x - s.x
let dy = center.y - s.y
let dist = Math.hypot(dx,dy)

if(dist>2){

s.x += dx/dist*1.2
s.y += dy/dist*1.2

}else{

s.target.troops--

if(s.target.troops<=0){

let oldOwner = s.target.owner
s.target.owner = s.owner

if(oldOwner==="enemy"){

factories.forEach(f=>{
let d = Math.hypot(f.x-center.x,f.y-center.y)
if(d<80) f.owner="player"
})

}

}

}

})

}

function economy(){

factories.forEach(f=>{
if(f.owner==="player") money+=0.02
})

}

function enemyAI(){

countries.forEach(c=>{

if(c.owner!=="enemy")return

if(Math.random()<0.002){

let center = centerOf(c)

factories.push({
x:center.x+Math.random()*40-20,
y:center.y+Math.random()*40-20,
owner:"enemy"
})

}

if(Math.random()<0.003){

let center = centerOf(c)

soldiers.push({
x:center.x,
y:center.y,
owner:"enemy",
target:countries[Math.floor(Math.random()*countries.length)]
})

}

})

}

function gameLoop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

economy()
enemyAI()
moveSoldiers()

drawCountries()
drawFactories()
drawSoldiers()

updateUI()

requestAnimationFrame(gameLoop)

}

gameLoop()
