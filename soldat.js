function Soldat(name)
{
  this.name = name || "random";
	this.iSoldat = new Image();
	this.iLoaded = 0;
	this.ready = false;
	this.spriteSheet = null;
	this.animation = null;
	this.path = "img/running2.png";
	this.pressing = false;
	this.mode = "run";
	this.direction = 90;
}
Soldat.prototype = {
	init: function() {
		this.iSoldat.src = this.path;
		this.iSoldat.onerror = handleImageError;	
	    this.iSoldat.onload = this.build.call(this);	
	},
	build: function(event) {
		 var spriteSheet = new createjs.SpriteSheet({
	  		images: [this.iSoldat],
	  		frames: {width:33, height:40, regX:20, regY:20},
	  		animations: {
	  			run: [0,11,"run",3],
	  			idle: [12,14,"idle",14]
	  		}
		});
		
		console.log(spriteSheet);

		createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);

	    this.animation = new createjs.BitmapAnimation(spriteSheet);
	    this.animation.name = name;
	    this.animation.direction = 90;
	  	this.animation.vX = 1.8;
	  	this.animation.vY = 0;
	  	this.animation.x = 16;
	  	this.animation.y = 32;
	  	this.animation.shadow = new createjs.Shadow("#454", 7, 0, 2);
	 	this.animation.regX = this.animation.spriteSheet.frameWidth / 2 | 0;
   		this.animation.regY = this.animation.spriteSheet.frameHeight / 2 | 0;

   		this.animation.currentFrame = 0;
   		this.addToStage.call(this);
   		this.animation.gotoAndPlay("run_h");     //runing from left to right
   		
   		startGame();
	},
	setDirection: function(dir) {
		this.animation.direction = dir;
		if(dir == 90 ) {
			// we want the sprite to turn right
				this.animation.gotoAndPlay(this.mode+"_h");     //runing from left to right
		}
		else if (dir == -90) {
			this.animation.gotoAndPlay(this.mode);
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
	setMode: function(mode){
		this.mode = mode;
		this.setDirection.call(this,this.animation.direction);
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
	update:function() {
		if(this.mode != "idle")
		{
			this.move();
		}
	}
}
