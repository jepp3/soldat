/**
* Moving soldat
* is printed with canvas/sprites 
* has methods as move 
**/
window.Key = {
  pressed: {},

  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40,
  SPACE:  32,
  A:      65,
  S:      83,
  D:      68,
  w:      87,
  
  isDown: function(keyCode, keyCode1) {
    return this.pressed[keyCode] || this.pressed[keyCode1];
  },
  
  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
  }
};
window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);



var canvas;
var stage; 
var numberOfImages = 0;
var totalNumberOfImages = 1;
var screen_width =0, screen_height = 0;
function handleImageLoad(e)
{
    numberOfImages++;

	if(numberOfImages == totalNumberOfImages)
	{
		startGame();
	}
}
function handleImageError(e)
{
	console.log("Image error somewhere");
}

function resetScreen()
{
	stage.removeAllChildren();
  	createjs.Ticker.removeAllListeners();
  	stage.update();
}


function Soldat(name)
{
	this.name = name || "random";
	this.iSoldat = new Image();
	this.iLoaded = 0;
	this.ready = false;
	this.spriteSheet = null;
	this.animation = null;
	this.path = "img/running.png";
	console.log("constructor invoked");
}


Soldat.prototype = {
	init: function() {


		this.iSoldat.src = this.path;
		this.iSoldat.onerror = handleImageError;
		this.iSoldat.onload = this.build.call(this);
		console.log("init soldat");
	},
	build: function() {

		 this.spriteSheet = new createjs.SpriteSheet({
	  		images: [this.iSoldat],
	  		frames: {width:33, height:40, regX:20, regY:20},
	  		animations: {
	  			walk: [0,11,"walk",5]
	  		}
		});

	   	createjs.SpriteSheetUtils.addFlippedFrames(this.spriteSheet, true, false, false);

	    this.animation = new createjs.BitmapAnimation(this.spriteSheet);
	    this.animation.name = name;
	    this.animation.direction = 90;
	  	this.animation.vX = 2;
	  	this.animation.vY = 0;
	  	this.animation.x = 16;
	  	this.animation.y = 32;

	 	this.animation.regX = this.animation.spriteSheet.frameWidth / 2 | 0;
   		this.animation.regY = this.animation.spriteSheet.frameHeight / 2 | 0;

   		this.animation.currentFrame = 0;
   		this.addToStage.call(this);
   		this.animation.gotoAndPlay("walk_h");     //walking from left to right

//   		this.animation.gotoAndPlay("walk");

   		console.log("build soldat");
	},
	setDirection: function(dir) {

		this.animation.direction = dir;

		if(dir == 90) {
			// we want the sprite to turn right
			this.animation.gotoAndPlay("walk_h");     //walking from left to right
		}
		else {
			this.animation.gotoAndPlay("walk");
			// we want the sprite to turn left
		}
	},
	setSpeed: function(speed) {
		this.animation.vX = speed;
	  	this.animation.vY = speed;
	},
	setState: function(state) {
		this.animation.gotoAndPlay(state);

	},
	addToStage: function() {
		stage.addChild(this.animation);

	},
	move: function() {
			if (this.animation.direction == 90) {
	           this.animation.x += this.animation.vX;
	           this.animation.y += this.animation.vY;
	        }
	        else {
	           this.animation.x -= this.animation.vX;
	           this.animation.y -= this.animation.vY;
	        }	    	
	},
	update: function() {
      	if (Key.isDown(Key.LEFT)){
      		this.setDirection.call(this,-90);
      		console.log("left");
      	}
      	if (Key.isDown(Key.RIGHT)) {
      		this.setDirection.call(this,90);
      		console.log("right");
      	}
	}
}


function tick() {
  		// check if we are walking outside the canvas
  		window.s.update();
  		window.s.move();

        stage.update();
}
function build()
{
	window.s.build();
}
function startGame()
{
	canvas = document.getElementById("testCanvas");

	stage = new createjs.Stage(canvas);
	screen_width = canvas.width;
	screen_height = canvas.height;

	window.s = new Soldat("soldat1");
	window.s.init();
	window.s.setDirection(90);

	createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

startGame();





/**
 * Trace the keys pressed
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
 */
