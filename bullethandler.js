function BulletHandler (max,stage) {
 	this.num = 0;
	this.bullets = new Array();
	this.max = max; 
	this.stage = stage;
}

BulletHandler.prototype = {

	add: function(bullet)
	{
		if(this.num == this.max)
		{
			this.num = 0;
		}
		this.bullets[this.num] = bullet;
		this.bullets[this.num].init();
		stage.addChild(this.bullets[this.num].shape);

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
	}
}
