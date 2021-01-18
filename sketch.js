var dog,sadDog,happyDog, database;
var food,foodStock;
var readState;
var fedTime,lastFed,Time;
var feed,addFood;
var foodObj;
var gameState

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
bedroom=loadImage("Images/Bed Room.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");

}

function setup() {
  database=firebase.database();
  createCanvas(800,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(600,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {

  background(200,139,87);
 Time=22;
  if(Time==(lastFed+1)){
    update("Sleeping");
    foodObj.bedroom();

   }
   else if(Time==(lastFed+2)){
    update("Playing");
    foodObj.garden();
   }else if(Time>(lastFed+2) && Time<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
  //  dog.addImage(sadDog);
   }
 
  drawSprites();
}


function readStock(data){
  food=data.val();
  foodObj.updateFoodStock(food);
}


function feedDog(){
  
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    FeedTime :lastFed,
    currentTime:Time,
    gameState:"Hungry"
  })
}

function addFoods(){
  food++;
  database.ref('/').update({
    Food:food
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}