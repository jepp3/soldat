function BulletHandler (max,stage) {
 	this.num = 0;
	this.bullets = new Array();
	this.max = max; 
	this.stage = stage;	
}

BulletHandler.prototype = {
	add: function(bullet)
	{
	
	
		//this.stage.addChild(this.container);
		if(this.num == this.max)
		{
			this.clear.call(this);
		}
	
		this.bullets[this.num] = bullet;
		this.bullets[this.num].init();
		this.stage.addChild(this.bullets[this.num].shape);

		this.num++;
	},
	at: function(i)
	{
		return this.bullets[i];
	},
	getIndex: function()
	{
		return this.num;
	},
	last: function()
	{
		return this.bullets[this.num-1];
	},
	clear: function()
	{
		
		for(var i = 0; i < this.num; i++)
		{
			
			this.bullets[i].shape.y = -100;
		//	this.bullets[i].alive = false;
			this.stage.removeChild(this.bullets[i].shape);
			this.bullets[i] = null;
			
		}

		this.num = 0;
	}
}
