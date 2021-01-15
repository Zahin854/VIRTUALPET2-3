
//Create variables here
var dog,dogImage;
var happyDog
var database,foodS,foodStock;
var lastFed
function preload()
{
	dogImage=loadImage("images/dogImg.png")
  //happyDog=loadImage("images/dogImg1.png")
  garden=loadImage("virtual pet images/Garden.png")
  washroom=loadImage("virtual pet images/Wash Room.png")
  bedroom=loadImage("virtual pet images/Bed Room.png")
sadDog= loadImage("virtual pet images/Dog.png")
happyDog=loadImage("virtual pet images/happy dog.png")
  //load images here
}

function setup() {
  database=firebase.database()
  createCanvas(500,500);
  foodObj= new Food()


  foodStock=database.ref('Food')
  foodStock.on("value",readStock)

  fedTime=database.ref('FedTime')
  fedTime.on("value",function(data){
    lastFed= data.val()
  })

  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState= data.val()
  })


  dog=createSprite(250,300,150,150);
  dog.addImage(sadDog)
  dog.scale=0.15
  //foodStock=database.ref('Food')
  feed= createButton("feed the dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)

  addFood= createButton("add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
}


function draw() {  
 currentTime=hour()
 if(currentTime==lastFed+1){
   update("Playing")
   foodObj.garden()
   
 }
 else if (currentTime==lastFed+2){
   update("Sleeping")
   foodObj.bedroom()
 }
 else if(currentTime>(lastFed+2)&&currentTime<=lastFed+4){
   update("Bathing")
   foodObj.washroom()
 }
 else {
   update("Hungry")
   foodObj.display()
 }
 if(gameState!="Hungry"){
feed.hide()
addFood.hide()
dog.remove()
 }
 else{
   feed.show()
   addFood.show()
   dog.addImage(sadDog)
 }
 drawSprites();
}

function readStock(data){
  foodS=data.val()
  foodObj. updateFoodStock(foodS)
}

function writeStock(x){
  if(x<=0){
    x=0
    console.log(foodS)
  }
  else{
    x=x-1
  }
database.ref('/').update({
  Food:x
})
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function feedDog(){
  dog.addImage(happyDog)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FedTime:hour(),
    gameState:"Hungry"
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
