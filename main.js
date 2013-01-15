/**
* Moving soldat
* is printed with canvas/sprites 
* has methods as move 
**/
"use strict";

var downNow = false, canvas, stage, numberOfImages = 0, totalNumberOfImages = 3,
screen_width =0, screen_height = 0,enemies = new Array(), p,scoreBoard,label;
var images = {
	over: new Image(),
	under: new Image(),
	shieldEnemy: new Image()
};

// when the dom has loaded, invoke the preparations funktions,
//that is a "constructor" for the game

$(document).ready(function() {

	canvas = document.getElementById("metal_slug");
	preparations();
	

		/**
	* This starts the game, sets the fps and tells the brobrwser to use RAF
	*
	*/
	function startGame()
	{
		window.s = new Soldat(stage);
		window.s.init(images.under,images.over);



		/*enemies[0] = new ShieldEnemy(stage,"0");
		enemies[0].init(images.shieldEnemy);
		enemies[0].setPos(400,120);

		enemies[1] = new ShieldEnemy(stage,"1");
		enemies[1].init(images.shieldEnemy);
		enemies[1].setPos(300,120);


*/


		label = new Label(stage);

		
		p = new HealthBar(stage);	
		p.init();
		p.setHealth(100);

		stage.addChild(window.s.returnSoldier());
//		stage.addChild(enemies[0].returnEnemy());
		//stage.addChild(enemies[1].returnEnemy());


		var pos = window.s.getPos();
		for(var k = 0; k < 5;k++)
		{
			enemies[k] = new ShieldEnemy(stage,k+"");
			enemies[k].init(images.shieldEnemy);
			stage.addChild(enemies[k].returnEnemy());
			enemies[k].setPos(Math.floor((Math.random()*(pos.x+500))+(pos.x+200)),120);
		}


	//	label.gameOver();

		scoreBoard = new ScoreBoard(stage);
		scoreBoard.init();


		Map.addForgorund();
		



		createjs.Ticker.addListener(tick);
	    createjs.Ticker.useRAF = true;
	    createjs.Ticker.setFPS(60);
	}
	/**
	*	Function that starts the game when everything has loaded
	*	not used know, because we only have one soldat
	*/
	function gameLoader(e)
	{
		numberOfImages++;
		if(numberOfImages == totalNumberOfImages)
		{
	
			startGame();
		}
	}

	/**
	* clears the screen, used on "game over" etc.
	*/
	function resetScreen()
	{
		stage.removeAllChildren();
	  	createjs.Ticker.removeAllListeners();
	  	stage.update();
	}


	function resetEnemy(index)
	{
	//	console.log("reset enemy"+index);
		stage.removeChild(enemies[index].returnEnemy());
		enemies[index] = new ShieldEnemy(stage,""+index);
		enemies[index].init(images.shieldEnemy);
		stage.addChild(enemies[index].returnEnemy());
		var pos = window.s.getPos();


	//	Math.floor((Math.random()*100)+1); 


		enemies[index].setPos(Math.floor((Math.random()*(pos.x+500))+(pos.x+200)),120);
	}

	/*
	*	This is the game loop that runs in x fps. 
	*/
	function tick() {
	  		
	  		// update soldier
	  		// s.update();
	  		window.s.update();
	  	//	window.b.setPos(stage.mouseX,stage.mouseY);
	  //		window.b.setDestination(stage.mouseX,stage.mouseY);

			var i = 0,j = 0;
			for(i = 0; i < enemies.length;i++)
			{
	  			window.enemies[i].ai(window.s.getPos());
	  			j = 0;
	  			for(j = 0; j < window.enemies[i].bullets.num;j++)
	  			{
	  				if(window.enemies[i].bullets.at(j).update(window.s.returnSoldier()))
	  				{
	  					p.setHealth(p.health-5);

	  					if(p.health <= 0)
	  					{
	  						window.s.die("die");
	  						label.gameOver();
	  					}
	  				}
	  			}
	  		}



	  		// take the soldiers bullets , and check if they hit anything


	    	
	    	for(i =0; i < window.s.bullets.num; i++)
	    	{
	    		j = 0;
	    		for(j = 0; j < enemies.length; j++)
	    		{
	    			if(window.s.bullets.at(i).update(enemies[j].returnEnemy()))
	    			{

	    				console.log("bulet hit enemy");
	    				enemies[j].die(enemies[j].way);
	    				scoreBoard.addScore(20);
	    				setTimeout(resetEnemy, 800, j);
	    				//stage.removeChild(enemies[j].returnEnemy());
	    			}
	    		}
	    	}
	        p.update();
	        scoreBoard.update();
	        stage.update();

	}
	/**
	*	This is the "constructor" of the game. its the first function to be called.
	*	It creates the object. When this function is finished,
	*	the startGame will be called by gameLoader
	*/
	function preparations()
	{
		stage = new createjs.Stage(canvas);
		screen_width = canvas.width;
		screen_height = canvas.height;

		var name = "mission1"; // TEMP placed var
		Map.init(stage, name);

		images.over.src = "img/over.png";
		images.over.onerror = handleImageError;
		images.over.onload  = gameLoader;

		images.under.src = "img/under.png";
		images.under.onerror = handleImageError;
		images.under.onload  = gameLoader;


		images.shieldEnemy.src = "img/sheild_run.png";
		images.shieldEnemy.onerror = handleImageError;
		images.shieldEnemy.onload = gameLoader;
		//startGame();
		var jumping = false;




		window.addEventListener('keyup',   function(event) {
			Key.onKeyup(event);
			downNow = false;

			var soldierPos = window.s.getPos();

			if(Key.isDown(Key.A) || Key.isDown(Key.D))
			{
				downNow = true;
			}
			else
			{
				if(soldierPos.y > stage.mouseX - stage.x)
				{
					window.s.idle(DIRECTION.LEFT);
				}
				else
				{
					window.s.idle(DIRECTION.RIGHT);
				}
			}

		//	window.s.idle(window.s.getCurrentDirection());
		},   false);

		window.addEventListener('keydown', function(event) {
			Key.onKeydown(event);
			var soldierPos = window.s.getPos();
			if(downNow == false) // removes the "multiclicks"
			{
		  		
		  		if(Key.isDown(Key.A) && soldierPos.x < stage.mouseX - stage.x)
		  		{
		  			window.s.reverse(DIRECTION.LEFT);
		  		}
		  		else if(Key.isDown(Key.D) && soldierPos.x > stage.mouseX - stage.x)
		  		{
		  			window.s.reverse(DIRECTION.RIGHT);
		  		}
				else if(Key.isDown(Key.D)) // <-
				{
					window.s.run(DIRECTION.RIGHT);
				}
				else if(Key.isDown(Key.A)) // ->
				{
					window.s.run(DIRECTION.LEFT);
				}
				downNow = true;

			}

			if(Key.isDown(Key.SPACE))
			{
				window.s.jump(window.s.getCurrentDirection());
				jumping = true;
		//		console.log("SPACE");
			}
		},	false);

		canvas.onclick = function(){
			var soldierPos = window.s.getPos();
	//		var p = window.s.getPos();
	//		var angle = window.s.getAngle();
	//		window.b.fire(p.x,p.y,angle);

			if(soldierPos.x > stage.mouseX - stage.x)
			{

				window.s.shoot(DIRECTION.LEFT);
			//	console.log(stage.x)
			}
			else
			{
				window.s.shoot(DIRECTION.RIGHT);
			}
		};


	}


 	
});

/*
	*	Invoked when theres an error with the sprite images
*/
function handleImageError(e)
{
	console.log("Image error somewhere");
}
