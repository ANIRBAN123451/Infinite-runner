
//Declaring global variables
var trex,trexCollidedImage,trexImage;
var ground,groundImage;
var invisibleGround;
var cloudImage;
var obstaclesImage1,obstaclesImage2,obstaclesImage3,obstaclesImage4,obstaclesImage5,obstaclesImage6;

var score=0;
var highscore=0;

var groupClouds;
var groupCacti;

var gameOver,gameOverImage;
var restart,restartImage;

var die,checkpoint,jump,dieSound,jumpSound,checkpointSound;

var PLAY=1;
var END=0;
var gameState=PLAY;
function preload() {
  // Uploading animation and images
  trexImage=loadAnimation("trex1.png","trex3.png","trex4.png");
    groundImage=loadImage("ground2.png");

  cloudImage=loadImage("cloud.png");
  
  obstacleImage1=loadImage("obstacle1.png");
  obstacleImage2=loadImage("obstacle2.png");
  obstacleImage3=loadImage("obstacle3.png");
  obstacleImage4=loadImage("obstacle4.png");
  obstacleImage5=loadImage("obstacle5.png");
  obstacleImage6=loadImage("obstacle6.png");
  trexCollidedImage=loadImage("trex_collided.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  dieSound=loadSound("checkPoint.mp3");
  checkpointSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  //edges=createEdgeSprites();
  // Creating trex sprite
  trex=createSprite(50,150,20,20);
  trex.addAnimation("trexAnimation",trexImage);
  trex.addAnimation("trexCollidedAnimation",trexCollidedImage);
  trex.scale=0.6; 
  trex.setCollider("circle",24,0,20);
  trex.debug=false;
  // Creating ground sprite
  ground=createSprite(300,180,600,20);
  ground.addImage("groundImage",groundImage);
  //Creating invisible ground sprite
  invisibleGround=createSprite(300,190,600,20);
  invisibleGround.visible=false;
  //Creating game over and restart sprites
  gameOver=createSprite(300,50,20,20);
  restart=createSprite(300,100,20,20);
  restart.addImage("restartImage",restartImage);
  gameOver.addImage("gameOverImage",gameOverImage);
  restart.scale=0.5;
  gameOver.scale=0.6;
  // Creating groups
  groupClouds= new Group();
  groupCacti= new Group();

  window.focus();
}

function draw() {
  background(180);
  //Colliding with ground
  trex.collide(invisibleGround);
 
  if(gameState===PLAY){
  // Making the ground move
  //ground.velocityX=-(10+5*score/100);
 // ground.velocityX=-(10);
 
  //MAKING TREX MOVE
  trex.velocityX=4;
  camera.position.x= trex.x;
  //Resetting the ground
  if(ground.x +300>camera.position.x ){
    ground.x=camera.position.x;
    invisibleGround.x= camera.position.x;
   }
    
  //Displaying the score
  fill("Black");
  textSize(15);
  text("score="+score,camera.position.x+200,50);
  score=score+Math.round(getFrameRate()/60);
  if(score%100===0 && score>0){
     checkpointSound.play();
}  
  


  // Making trex jump
  if(keyDown("Space")&&trex.y>140){
     trex.velocityY=-10;
     jumpSound.play();
     }
  //Adding gravity to the trex
  trex.velocityY=trex.velocityY+0.5;
  
  //Creating clouds
  spawnCloud();
  obstacles();
    restart.visible=false;
    gameOver.visible=false;
  //Going into END state
    if(trex.isTouching(groupCacti)){
      gameState=END;
      dieSound.play();
  }
  }
  else if(gameState===END){
   //ground.velocityX=0; 
   trex.velocityX=0;
   groupClouds.setVelocityXEach(0);
   groupCacti.setVelocityXEach(0);
   trex.y=160;
 trex.changeAnimation("trexCollidedAnimation",trexCollidedImage);
    groupClouds.setLifetimeEach(-1);
    groupCacti.setLifetimeEach(-1);
    restart.x = camera.position.x;
    gameOver.x = camera.position.x;
    restart.visible=true;
    gameOver.visible=true;
    if(mousePressedOver(restart)){
    restartNow();
}
  }

  drawSprites();
}
function spawnCloud(){
  if(frameCount%100===0){
  var clouds=createSprite(camera.position.x+width/2,40,10,10);
  clouds.addImage("cloudImage",cloudImage);
  //clouds.velocityX=-(8+5*score/100);
  //clouds.velocityX=-(8);
  clouds.scale=0.2;
  clouds.depth=trex.depth;
  trex.depth=trex.depth+1;
  clouds.y=Math.round(random(1,100));
  clouds.lifetime=85;
  groupClouds.add(clouds);
  }
}
function obstacles(){
  if(frameCount%100===0){
  var cactus=createSprite(camera.position.x+width/2,160,10,40);
 // cactus.velocityX=-(8+5*score/100);
 //cactus.velocityX=-(8);
  var rand =Math.round(random(1,6));  
  switch(rand){
    case 1: cactus.addImage("cactusImage1",obstacleImage1) ;break; 
    case 2: cactus.addImage("cactusImage2",obstacleImage2) ;break;
    case 3: cactus.addImage("cactusImage3",obstacleImage3) ;break;
    case 4: cactus.addImage("cactusImage4",obstacleImage4) ;break;
    case 5: cactus.addImage("cactusImage5",obstacleImage5) ;break;
    case 6: cactus.addImage("cactusImage6",obstacleImage6) ;break;
    default:break;
  }
  cactus.scale=0.08;
  cactus.lifetime=85;
  groupCacti.add(cactus);
  }
}

function restartNow(){
  gameState=PLAY;
  groupCacti.destroyEach();
  groupClouds.destroyEach();
  trex.changeAnimation("trexAnimation",trexImage);
  score=0;
}