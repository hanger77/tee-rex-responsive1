var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage, cloud;
var obstacleSprite, obstacle1Image,obstacle2Image, obstacle3Image, obstacle4Image, obstacle5Image, obstacle6Image;
var obstacleGroup;
var cloudGroup;
var gameOverImage,gameOver;
var restartImage,restart;
var score;

var PLAY = 0;
var END = 1;
var gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudImage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png");
  obstacle1Image = loadImage("obstacle1.png");
  obstacle2Image = loadImage("obstacle2.png");
  obstacle3Image = loadImage("obstacle3.png");
  obstacle4Image = loadImage("obstacle4.png");
  obstacle5Image = loadImage("obstacle5.png");
  obstacle6Image = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")


}

function setup() {
 
  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,height - 50,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(200,height - 20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  //creating invisible ground
  invisibleGround = createSprite(200,height - 10,400,10);
  invisibleGround.visible = false;
  
  //generate random numbers
  //var rand =  Math.round(random(1,100))
  //console.log(rand)
  score = 0;
  
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  //view colider
  trex.debug = true
  trex.setCollider("circle", 0,0,40);
  
  gameOver = createSprite(300,100, 5,1);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.visible = false;
  restart = createSprite(300, 50,5,5);
  restart.addImage("restartImage", restartImage);  
  restart.visible = false;
}

function draw() {
  //set background color
  background("white");
   
  console.log(trex.y)
  
  if(gameState === PLAY){

        // jump when the space key is pressed
    if(keyDown("up")&& trex.y >= height -40 || touches.length > 0) {
      trex.velocityY = -14;
        jumpSound.play();
      touches = []
    }
  
    
    if (score % 100 === 0 && score > 0){
      checkPointSound.play();
    }
  
      //scroll effect
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
        //Calling Spawn Clouds function
    spawnClouds();


    console.log(frameCount);

    spawnObstacles();

    score = score + 1

    if(trex.isTouching(obstacleGroup)){
        dieSound.play();
        gameState = END;
    }
    
  }
  else if(gameState === END){
    
      ground.velocityX = 0;

      obstacleGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0);

      obstacleGroup.setLifetimeEach(-3);
      cloudGroup.setLifetimeEach(-3);

      trex.addAnimation("trex_collided", trex_collided);
      trex.changeAnimation("trex_collided", trex_collided);

      restart.visible = true;
      gameOver.visible = true;
  
      if(mousePressedOver(restart)){
        restartFunction();
      }
  
  }


  
  //gravity
  trex.velocityY = trex.velocityY + 0.8;
  
  
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  drawSprites();
  
  
  text("score: " + score, 550, height -200);
  
 
}

//function to spawn the clouds
function spawnClouds(){

  if(frameCount % 60 === 0){
    cloud = createSprite(600, height - 100, 20,10);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.y = round(random(height - 60,height - 300));
    cloud.velocityX = -5;
    cloud.addImage("cloudImage", cloudImage);
    cloud.lifetime = 140;
    cloudGroup.add(cloud);
    }
}

function spawnObstacles(){
  var rand =  Math.round(random(40,60))
  var randImage =  Math.round(random(1,6))
  if(frameCount % rand === 0){
    obstacleSprite = createSprite(600,height - 35,10,10);
    obstacleSprite.velocityX = -4;
    obstacleSprite.lifetime = 160;
    switch(randImage){
        case 1:obstacleSprite.addImage("obstacle1Image", obstacle1Image);
          break;
        case 2:obstacleSprite.addImage("obstacle2Image", obstacle2Image);
          break;
        case 3:obstacleSprite.addImage("obstacle3Image", obstacle3Image);
          break;
        case 4:obstacleSprite.addImage("obstacle4Image", obstacle4Image);
          break;
        case 5:obstacleSprite.addImage("obstacle5Image", obstacle5Image);
          break;
        case 6:obstacleSprite.addImage("obstacle6Image", obstacle6Image);
          break;
  }
    obstacleSprite.scale = .5;
    
    obstacleGroup.add(obstacleSprite);
  }
}

function restartFunction(){
  
  gameState = PLAY;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  ground.velocityX = -4;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);
  score = 0;
  
  
}

