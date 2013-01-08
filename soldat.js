'use strict';
function Soldat(stage)
{
	this.images = {over: null, under: null};
	this.totImagesToLoad = 2;
	this.numberOfLoadedImages = 0;
	this.animations = {over: null, under:null};
	this.ready = false;
	this.soldier = new createjs.Container();
	this.mode = "run";
	this.direction = 90;
	this.way = -1;
	this.stage = stage;
}
Soldat.prototype = {
	init: function(under,over) {
		this.images.over =over;
		this.images.under = under;
		this.build.call(this);
	},
	build: function() {
		//	Create sprites for runing , standing , walking (12 x 3)
		var underSprite = new createjs.SpriteSheet({
	  		images: [this.images.under],
	  		frames: {width:31, height:20, regX:10, regY:10},
	  		animations: {
	  			run: [0,5,"run",6],
	  			idle: [6,8,"idle",20]
	  		}
		});
		

		var overSprite = new createjs.SpriteSheet({
	  		images: [this.images.over],
	  		frames: {width:56.5, height:26, regX:13, regY:13},
	  		animations: {
	  			shoot: [0,6,"idle",6],
	  			idle: [7,7,"idle",20]
	  		}
		});
        createjs.SpriteSheetUtils.addFlippedFrames(underSprite, true, false, false);
		createjs.SpriteSheetUtils.addFlippedFrames(overSprite, true, false, false);

	  	this.animations.over = new createjs.BitmapAnimation(overSprite);
	  	this.animations.over.name = "s";
	  	this.animations.over.regX = this.animations.over.spriteSheet.frameWidth / 2 | 0;
   		this.animations.over.regY = this.animations.over.spriteSheet.frameHeight / 2 | 0;
		
	  	this.animations.over.x = 0;
	  	this.animations.over.y = 0;
	  	this.animations.over.currentFrame = 0;

	  	this.animations.under = new createjs.BitmapAnimation(underSprite);
	  	this.animations.under.name = "s";
	  	this.animations.under.regX = this.animations.under.spriteSheet.frameWidth / 2 | 0;
   		this.animations.under.regY = this.animations.under.spriteSheet.frameHeight / 2 | 0;
		
	  	this.animations.under.x =0;
	  	this.animations.under.y = 18;
	  	this.animations.under.currentFrame = 0;

	  	this.soldier.addChild(this.animations.under);
		this.soldier.addChild(this.animations.over);

		this.animations.over.gotoAndPlay("idle"); 
		this.animations.under.gotoAndPlay("idle"); 
		
		this.soldier.x = 100;
		this.soldier.y = 100;
		this.soldier.vY = 0;
		this.soldier.vX = 0;
	},
	returnSoldier: function()
	{
		return this.soldier;
	},
	setDirection: function(mode) {

		if(this.direction == -90 ) {
			
			console.log(mode+"_h");
			
			this.animations.under.gotoAndPlay(mode+"_h");     //runing from left to right
			this.animations.over.gotoAndPlay("idle_h");
		}
		else if (this.direction == 90) {
			
			this.animations.under.gotoAndPlay(mode);
			this.animations.over.gotoAndPlay("idle");
			
		}
	},
	getCurrentDirection: function()
	{
		return this.direction;
	},
	move: function() {
		if (this.direction == 90) {
          	this.soldier.x += this.soldier.vX;
           this.soldier.y += this.soldier.vY;
        }
        else {
          	this.soldier.x -= this.soldier.vX;
           this.soldier.y -= this.soldier.vY;
        }	    	
	},
	idle: function(dir) {
		this.direction = dir;
		this.soldier.vX = 0;
		//this.animations.under.gotoAndPlay("idle");
		this.setDirection.call(this,"idle");
	},
	walk: function(dir) {
		// set speed
		// set sprite
		this.soldier.vX = 1;
		this.animations.under.gotoAndPlay("walk");
	},
	run: function(dir) {
		// set speed
		// set sprite
		this.direction = dir;
		this.soldier.vX = 1.8;
		this.setDirection.call(this,"run");
		//this.animations.under.gotoAndPlay("run");

	},
	shoot: function() {
		if(this.direction == 90)
		{
			this.animations.over.gotoAndPlay("shoot");
		}
		else
		{
			this.animations.over.gotoAndPlay("shoot_h");	
		}
	},
	die: function(wayToDie) {

	},
	update:function() {
		// code for the rotiation 
		var cx = this.soldier.x;
		var cy = this.soldier.y;

		var mx, my = 0;
    	mx = this.stage.mouseX;
    	my = this.stage.mouseY;
    	var angle = Math.atan2(my - cy, mx - cx) * 180 / Math.PI;

    	if(angle < 0) { angle = 360 + angle; }

    	//if(angle < 40 && angle > 0 || angle < 356 && angle > 320)
    	//{

    	if(this.stage.mouseX < this.soldier.x && this.direction != -90) {
    		this.idle.call(this,-90);
    	}
    	else if(this.stage.mouseX > this.soldier.x && this.direction != 90) {
    		this.idle.call(this,90);
    	}
    	if(this.direction == 90) {

    		this.animations.over.rotation = angle -25;
    	}
    	else {	
    		this.animations.over.rotation = angle +200;
    	}
    	

    	this.move();
	}
}
