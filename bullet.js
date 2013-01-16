function Bullet() {

  this.bullet = new createjs.Graphics();
	this.g = new createjs.Graphics();
	this.angle = 0;
	this.speed = 1;
	this.alive = false;
	this.shape = null;
	
}
Bullet.prototype = {
	init: function() 
	{
		this.g.setStrokeStyle();
	
		this.g.setStrokeStyle(1);
		this.g.beginStroke(createjs.Graphics.getRGB(255,250,0));
		this.g.beginFill(createjs.Graphics.getRGB(255,0,0));
		this.g.drawCircle(0,0,1.5);

		this.shape = new createjs.Shape(this.g);
		this.shape.x = 0;
		this.shape.y = 0;
		this.speed = 7;
		//console.log(this.shape);
	},
	setPos: function(x,y)
	{
		this.shape.x = x;
		this.shape.y = y;	
	},
	fire: function(x,y, angle)
	{
	//	console.log(this.shape);
		this.shape.y = y;
		this.shape.x = x;
		this.angle = angle;
		this.alive = true;
	//	console.log("fire");
	},
	setSpeed: function(speed)
	{
		this.speed = speed;
	},
	returnBullet: function()
	{
		
		return this.shape; 
	},
	update: function(target)
	{
		if(this.alive == true)
		{

			 var pt = target.globalToLocal(this.shape.x, this.shape.y);
	//		if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) { child.alpha = 1; } 
	

			//console.log(window.stage.x);
			if (target.hitTest(pt.x+window.stage.x, pt.y+window.stage.y))
			{
		//		console.log("hit");
				this.alive = false;
				this.shape.x = -5;
				this.shape.y = -5;

				return true; 
			}
			else
			{
				var a = this.angle * Math.PI / 180;
				this.shape.x = this.shape.x + this.speed * Math.cos(a);
				this.shape.y = this.shape.y + this.speed * Math.sin(a);

				return false;
		//		console.log(pos.x)
			}

		}
	}	
}
