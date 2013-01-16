/**
* Moving soldat
* is printed with canvas/sprites 
* has methods as move 
**/
"use strict";

var downNow = false, manifest, preload, canvas, stage, mission, jumping,
screen_width =0, screen_height = 0,enemies = new Array(), p,scoreBoard,label;
var images = {
	over: new Image(),
	under: new Image(),
	shieldEnemy: new Image()
};

// when the dom has loaded, invoke the preparations funktions,
//that is a "constructor" for the game

// $(document).ready(function() {

	canvas = document.getElementById("metal_slug");
	// preparations();
	

		/**
	* This starts the game, sets the fps and tells the brobrwser to use RAF
	*
	*/
	function startGame()
	{
		Map.init(stage, mission);

		window.s = new Soldat(stage);
		window.s.init();


	/*	enemies[0] = new ShieldEnemy(stage,"0");
		enemies[0].init();
		enemies[0].setPos(400,120);

		enemies[1] = new ShieldEnemy(stage,"1");
		enemies[1].init();
		enemies[1].setPos(300,120);
*/
		label = new Label(stage);

		
		p = new HealthBar(stage);	
		p.init();
		p.setHealth(100);

		stage.addChild(window.s.returnSoldier());

	//	stage.addChild(enemies[0].returnEnemy());
//		stage.addChild(enemies[1].returnEnemy());


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
		


		// createjs.SoundJS.play("main");
		createjs.Ticker.addListener(tick);
	    createjs.Ticker.useRAF = true;
	    createjs.Ticker.setFPS(60);
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

		mission = "mission1"; // TEMP placed
		preload = new createjs.PreloadJS();
		preload.installPlugin(createjs.SoundJS);
		preload.onProgress = Load._progress;
		preload.onComplete = Load._complete;
		preload.onFileLoad = Load.file;
		preload.onError = Load._error;

		manifest =[
				 {src:"img/over.png", id:"over"}
				,{src:"img/under.png", id:"under"}
				,{src:"img/sheild_run.png", id:"shield_run"}
			].concat(Sound.manifest, Map.getManifest(mission))

		preload.loadManifest(manifest);

		jumping = false;


	}

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
			}
		},	false);

		canvas.onclick = function(){
			var soldierPos = window.s.getPos();
	//		var p = window.s.getPos();
	//		var angle = window.s.getAngle();
	//		window.b.fire(p.x,p.y,angle);

			switch(Math.floor((Math.random()*3)+1)){
				case 1:
					createjs.SoundJS.play("pistol","INTERRUPT_ANY");
				break;
				case 2:
					createjs.SoundJS.play("pistol2","INTERRUPT_ANY");
				break;
				case 3:
					createjs.SoundJS.play("project", "INTERRUPT_NONE")
			}
			if(soldierPos.x > stage.mouseX - stage.x)
			{

				window.s.shoot(DIRECTION.LEFT);
			}
			else
			{
				window.s.shoot(DIRECTION.RIGHT);
			}

		};


	


 	
// });


