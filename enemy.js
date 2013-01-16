
function Enemy(stage,id)
{
  this.stage = stage;
	this.id = id;
	this.image = null;
	this.dead = false;
	this.animation = null;
	this.way = DIRECTION.LEFT;
	this.life = 10;
	this.damage = 0;
	
}
Enemy.prototype = {
	setPos: function(posX,posY)
	{
		this.animation.x = posX;
		this.animation.y = posY;
	},
	die: function(wayToDie)
	{	
		this.animation.visible = false;
	},
	resurrect: function()
	{
		this.animation.visible = true;
	},
	getPos: function()
	{
		return {x:this.animation.x,y:this.animation.y};
	},
	returnEnemy: function()
	{
		return this.animation;
	},
	move: function()
	{
		if (this.way == DIRECTION.RIGHT) {
        	this.animation.x += this.animation.vX;
           	this.animation.y += this.animation.vY;
        }
        else {
          	this.animation.x -= this.animation.vX;
           	this.animation.y -= this.animation.vY;
        }	    	
	},
	die: function(dir)
	{
		this.damage = 30;
		this.animation.vX = 2;
		this.mode = MODE.DEAD;
		if(dir == DIRECTION.RIGHT)
		{
			this.animation.gotoAndPlay("dead");
		}
		else
		{
			this.animation.gotoAndPlay("dead_h");
		}
	}
}
