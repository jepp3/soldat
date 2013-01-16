function HealthBar(stage) {
	this.g = new createjs.Graphics();
	this.s = null; // we will init this later
	this.stage = stage;
	this.health = 100;
}



function Label(stage) {

	this.txt = new createjs.Text('', 'Bold 35px Arial', 'red');
	this.stage = stage;
	this.txt.textAlign = "center";
	this.txt.x = 304/2;
	this.txt.y = 210/2-50;
	this.stage.addChild(this.txt);
}

Label.prototype = {

	gameOver: function()
	{
		console.log("game over");
		this.txt.color = "red";
		this.txt.font = "bold 35px Arial"
		this.txt.text = "GAME OVER!";
		this.txt.x = -window.stage.x +304/2;
		this.txt.y = -window.stage.y +210/2-50;
		
	},
	ultraKill: function()
	{
		this.txt.text = "ULTRA KILL!";
	},
	megaKill: function()
	{
		this.txt.text = "MEGA KILL!";
	},
	win: function()	
	{
		this.txt.text  = "WIN!!!";
	},
	loading: function(p)
	{
		this.txt.font = "bold 60px Arial"
		this.txt.color = "#FF5F00";
		this.txt.text  = "LOADING\n"+p+"%";
	},
	clear: function()
	{
		console.log("clear");
		this.txt.text = "";
	},
	remove: function()
	{
		console.log("removed");
		this.stage.removeChild(this.txt);
	},
	add: function()
	{
		console.log("added");
		this.stage.addChild(this.txt);
	}
}

HealthBar.prototype = {

	init: function()
	{
		this.g.setStrokeStyle(1);
		this.g.beginStroke(createjs.Graphics.getRGB(0,0,0));
		this.g.beginFill(createjs.Graphics.getRGB(255,255,255));
		this.g.drawRoundRectComplex(0,0,80,18,2,2,2,2);
		this.s = new createjs.Shape(this.g);

		this.stage.addChild(this.s);

		this.s.x = 0;
		this.s.y = 0;
		
	},

	setHealth: function(health)
	{
		if(health >= 0 && health <= 100)
		{
			var color = "#FF0000";
			if(health > 70) {
				color = "#008000";
			}
			else if( health <= 70 && health > 30) {
				color = "#FFFF00";
			}
			this.health = health;

			this.g.beginStroke("white");
			this.g.beginFill("white");
			
		//	this.g.drawRoundRect(2,1,79,17,1);
			this.g.drawRoundRect(1,2,78,14,1);
			//this.g.drawRoundRect(0,0,76,13,1);
			this.g.beginStroke(color);
			this.g.beginFill(color);
			this.g.drawRoundRect(2,3,(health/100)*75,12,1);
		}
	},
	update: function()
	{
		this.s.x = -window.stage.x +5;//= window.stage.x;
		this.s.y = -window.stage.y +5;//= window.stage.x;
	}
}


function ScoreBoard(stage) {
	this.stage = stage;
	this.txt = new createjs.Text('0', 'Bold 25px Arial', 'red');
	this.score = 0;
}

ScoreBoard.prototype = {
	init: function()
	{
		this.txt.text = "0";
		this.txt.y = 0;
		this.txt.x = 0;
		this.stage.addChild(this.txt);
		this.txt.textAlign = "right";
	},
	addScore: function(score)
	{
		this.score+=score;
	
		this.txt.text = this.score+"";//score.toString();
	},
	update: function()
	{
		this.txt.x = -window.stage.x + 290;
		this.txt.y = -window.stage.y +1;
	
	//this.txt.x = 100;
	}
}
