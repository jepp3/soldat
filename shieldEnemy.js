
function ShieldEnemy(stage,id)
{
  Enemy.call(this,stage,id);

	this.life = 10;
	this.damage = 0;
	this.ammo = 0;


	this.bullets = new BulletHandler(10,stage);
}
ShieldEnemy.prototype = new Enemy;
ShieldEnemy.prototype.init = function()
{
		var sprite = new createjs.SpriteSheet({
			images: [window["shield_run"]],
	  		frames: {width:55, height:49, regX:23, regY:24},
			animations: {
				run: [0,11,"run",2],
				idle: [28,28,"idle",4],
				takingupgun: [28,31,"shoot",2],
				shoot:[32,38,"shoot",2],
				protecting:[0,11,"protecting",2],
				stabbing:[12,29,"stabbing",2],
				dead:[38,50,"",2]
			}
		});

	//	createjs.SpriteSheetUtils.addFlippedFrames(sprite,true,false,false);
        createjs.SpriteSheetUtils.addFlippedFrames(sprite, true, false, false);

		this.animation = new createjs.BitmapAnimation(sprite);

		this.animation.name= this.id;
		
		this.animation.regX = this.animation.spriteSheet.frameWidth / 2 | 0;
   		this.animation.regY = this.animation.spriteSheet.frameHeight / 2 | 0;

	  	this.animation.currentFrame = 0;
	  	this.animation.vY = 0;
		this.animation.vX = 0;
		this.animation.x = 40;
		this.animation.y = 30;
		


		//this.animation.gotoAndPlay("run_h"); 
		this.run();
		
};
	/*
	* These functions are used by ai
	*/
ShieldEnemy.prototype.dead = function()
{
	console.log("called");
}
ShieldEnemy.prototype.run = function(dir)
{
		this.animation.vX = 1.3;
		this.damage = 40;
		this.way = dir;
		this.mode = MODE.RUNNING;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("run");   
		}
		else
		{
			this.animation.gotoAndPlay("run_h");
		}
};
ShieldEnemy.prototype.freeze = function() 
{
	this.animation.vX = 0;
	this.animation.vY = 0;
}
ShieldEnemy.prototype.idle = function(dir)
{
		
		this.damage = 40;
		this.animation.vX = 0;
		this.mode= MODE.IDLE;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("idle");   
		}
		else
		{
			this.animation.gotoAndPlay("idle_h");
		}
};
ShieldEnemy.prototype.shoot = function(dir)
{
		this.damage = 40;
		this.animation.vX = 0.2;
		this.mode = MODE.SHOOTING;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("takingupgun");   
		}
		else
		{
			this.animation.gotoAndPlay("takingupgun_h");
		}
};
ShieldEnemy.prototype.stabb = function(dir)
{
		this.damage = 80;
		this.animation.vX = 0;
		this.mode = MODE.STABBING;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("stabbing");
		}
		else
		{
			this.animation.gotoAndPlay("stabbing_h");
		}
};
ShieldEnemy.prototype.protect =  function(dir)
{
		this.damage = 30;
		this.animation.vX = 1.3;
		this.mode = MODE.PROTECTING;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("protecting");
		}
		else
		{
			this.animation.gotoAndPlay("protecting_h");
		}
};
ShieldEnemy.prototype.die = function(dir)
{

	if(this.mode != MODE.DEAD) {
		this.damage = 30;
		this.animation.vX = 1;
		this.mode = MODE.DEAD;
		this.life = 0;
		this.bullets.clear();
		switch(Math.floor((Math.random()*5)+1)){
				case 1:
					createjs.SoundJS.play("s1","INTERRUPT_NONE");
				break;
				case 2:
					createjs.SoundJS.play("s2","INTERRUPT_NONE");
				break;
				case 3:
					createjs.SoundJS.play("s3", "INTERRUPT_NONE")
				break;
				case 4:
					createjs.SoundJS.play("s4", "INTERRUPT_NONE")
				break;
				case 5:
					createjs.SoundJS.play("s5", "INTERRUPT_NONE")
				break
			}
		if(dir == DIRECTION.RIGHT) {
			this.animation.gotoAndPlay("dead");
		}
		else {
			this.animation.gotoAndPlay("dead_h");
		}
	}
};
ShieldEnemy.prototype.ai =  function(target)
{
	if(this.life > 0)
	{
			// om soldaten koliderar , 
			var offset = 25; 
			var distance = 0;
			var extension = "";
			var acceptangle = {min:0,max:0};


			this.animation.y-=offset;
			if(Collision.platform(this.animation,Map.platforms))
			{
				this.animation.y-=3; // höj soldaten lite , om vi fortfarande är under marken, icke bra
				if(Collision.platform(this.animation,Map.platforms) == false)
				{
					this.animation.y+=3;
				}
			} 
			else
			{
				this.animation.y+=4;
			}

			this.animation.y+=offset;


			if(target.x <= this.animation.x)
			{
				distance = this.animation.x - target.x;
				this.way = DIRECTION.LEFT;
			}
			else
			{
				distance = target.x -this.animation.x;
				this.way = DIRECTION.RIGHT;
			}

			if(distance > 150 && this.mode != MODE.RUNNING )
			{
				this.run.call(this,this.way);
			}
			else if(distance > 100 && distance < 150 && this.mode != MODE.SHOOTING)
			{
				this.shoot.call(this,this.way);
			}
			else if(distance > 20 && distance < 100 && this.mode != MODE.PROTECTING)
			{
				this.protect.call(this,this.way);
			}
			else if(distance <= 20 && this.mode != MODE.STABBING)
			{
				this.stabb.call(this,this.way);
					p.setHealth(0);
			}
			else if(this.mode == MODE.SHOOTING)
			{
				// reloading function
				this.ammo++;
				if(this.ammo == 150)
				{
					this.shoot.call(this,this.way);	
					this.ammo = 0;
				}
				else if(this.ammo % 20 == 0)
				{
					this.bullets.add(new Bullet());

					if(this.way == DIRECTION.LEFT)
					{
						this.bullets.last().fire(this.animation.x-20,this.animation.y-5,180);
					}
					else
					{
						this.bullets.last().fire(this.animation.x+10,this.animation.y-5,0);	
					}
				}
			}
		if(target.y < (this.animation.y - 50) || target.y > (this.animation.y +50))
		{
			this.idle(this.way);
		}
		else
		{
			this.move();
		}
	}
};

