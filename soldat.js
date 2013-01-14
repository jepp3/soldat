'use strict';
function Soldat(stage)
{
	this.images = {over: null, under: null};
	this.animations = {over: null, under:null};
	this.soldier = new createjs.Container();
	
	this.stage = stage;
	this.soldier.weight = {x:0,y:8};
	this.jumping = true;
	this.dead = false;
	this.way = DIRECTION.RIGHT;
	this.angle = 0;
	this.bullets = new BulletHandler(10,this.stage);
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
	  		frames: {width:30, height:20, regX:10, regY:10},
	  		animations: {
	  			run: [0,5,"run",5],
	  			idle: [6,8,"idle",20]
	  		}
		});


		var overSprite = new createjs.SpriteSheet({
	  		images: [this.images.over],
	  		frames: {width:56.5, height:26, regX:13, regY:13},
	  		animations: {
	  			shoot: [0,6,"idle",1],
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
	getPos: function()
	{
		return {x:this.soldier.x,y:this.soldier.y};
	},
	getAngle: function()
	{
		return this.angle;
	},
	returnSoldier: function()
	{
		return this.soldier;
	},
	setDirection: function(mode) {

		if(this.way == DIRECTION.LEFT ) {
			this.animations.under.gotoAndPlay(mode+"_h");     //runing from left to right
			this.animations.over.gotoAndPlay("idle_h");
		}
		else if (this.way == DIRECTION.RIGHT) {
			this.animations.under.gotoAndPlay(mode);
			this.animations.over.gotoAndPlay("idle");
		}
	},
	getCurrentDirection: function()
	{
		return this.way;
	},
	move: function() {
		if (this.way == DIRECTION.RIGHT) {
          	this.soldier.x += this.soldier.vX;
           this.soldier.y += this.soldier.vY;
        }
        else {
          	this.soldier.x -= this.soldier.vX;
           this.soldier.y -= this.soldier.vY;
        }
	},
	idle: function(dir) {
		this.way = dir;
		this.soldier.vX = 0;
		//this.animations.under.gotoAndPlay("idle");
		this.setDirection.call(this,"idle");
	},
	run: function(dir) {
		this.way = dir;

		this.soldier.vX = 2;
		this.setDirection.call(this,"run");
		//this.animations.under.gotoAndPlay("run");
	},
	reverse: function(dir) {
		this.way = dir;
		this.soldier.vX = 1;
		//this.setDirection.call(this,"run");
		if(this.way == DIRECTION.LEFT) {


			this.animations.under.gotoAndPlay("run");     //runing from left to right
		}
		else if (this.way == DIRECTION.RIGHT) {

			this.animations.under.gotoAndPlay("run_h");
		}
	},
	jump:function(dir) {
		if(!this.jumping){
			this.soldier.weight.y = 8;
			this.way = dir;
			this.jumping = true;
		}
	},
	shoot: function(dir) {
		if(dir == DIRECTION.RIGHT) {
			this.animations.over.gotoAndPlay("shoot");
		}
		else {
			this.animations.over.gotoAndPlay("shoot_h");	
		}


		// create an bullet that will fire in right direction
	//	console.log(this.bullets.length);

		this.bullets.add(new Bullet());
		this.bullets.last().fire(this.soldier.x,this.soldier.y,this.angle);
	},
	die: function(wayToDie) {
		this.soldier.visible = false;
		this.dead = true;
	},
	update:function() {
		if(this.dead == false) {
			var cx = this.soldier.x;
			var cy = this.soldier.y;

			var mx, my = 0;
	    	mx = this.stage.mouseX - stage.x;
	    	my = this.stage.mouseY - stage.y;
	    	var angle = Math.atan2(my - cy, mx - cx) * 180 / Math.PI;

	    	if(angle < 0) { angle = 360 + angle; }


	    	this.angle = angle;
// this.soldier.vY = this.soldier.weight.y;
// this.solider.vX = this.solider.weight.x;

	    	if(this.jumping == true || !Collision.platform(this.soldier, Map.platforms)) {
	    		this.jumping = true;
	    		this.soldier.weight.y = this.soldier.weight.y - 0.5;
				this.soldier.y -= this.soldier.weight.y;
				// this.soldier.vY = this.soldier.weight.y;
	    	}

	    	if(this.soldier.weight.y <= 0 && Collision.platform(this.soldier, Map.platforms)) {
	    		this.soldier.weight.y = 0;
	    		this.jumping = false;
	    	}

	  		// OM musen Ã¤rÂ¨pÃ¥ vÃ¤nster sida av soldaten  och  vi gÃ¥r Ã¥t hÃ¶ger
	    	if(this.stage.mouseX - stage.x < this.soldier.x  && Key.isDown(Key.D) ==true) {
	    			//this.idle.call(this,-90);
	    			//
	    			this.animations.over.rotation = angle +200;
	    	}
	    	// OM musen Ã¤r pÃ¥ hÃ¶gersida av soldaten och vi gÃ¥r Ã¥t vÃ¤nster
	    	else if(this.stage.mouseX - stage.x > this.soldier.x && Key.isDown(Key.A) ==true) {
	    			//this.idle.call(this,90);	
	    			this.animations.over.rotation = angle -25;
	    	}
	    	// om musen Ã¤r pÃ¥ vÃ¤nster sida, och vi inte trycker pÃ¥ D
	    	else if(this.stage.mouseX - stage.x < this.soldier.x  && Key.isDown(Key.D) === undefined) {
	    		if(this.way != DIRECTION.LEFT) {// om vi inte redan Ã¤r pÃ¥ vÃ¤nster sida( byta ut mot enum)
	    			this.idle.call(this,DIRECTION.LEFT);
	    			this.way = DIRECTION.LEFT;
	    		}
	    		this.animations.over.rotation = angle +200;
	    	}

	    	// OM musen Ã¤r pÃ¥ hÃ¶ger sida och vi intetrycker pÃ¥ A
	    	else if(this.stage.mouseX - stage.x > this.soldier.x && Key.isDown(Key.A) === undefined) {

	    		if(this.way != DIRECTION.RIGHT) {// om vi inte redan Ã¤r pÃ¥ hÃ¶ger sida
	    			this.idle.call(this,DIRECTION.RIGHT);
	    			this.way = DIRECTION.RIGHT;
	    		}
	    		//this.idle.call(this,90);    		
	    		this.animations.over.rotation = angle -25;
	    	}

// console.log(this.soldier.x)
	    	if(!Collision.grid(this.soldier, this.way)){
		    	this.move();
		    }
	    }
	}

}