/**
* Moving soldat
* is printed with canvas/sprites 
* has methods as move 
**/
"use strict";

var downNow = false, canvas, stage, numberOfImages = 0, totalNumberOfImages = 2,
screen_width =0, screen_height = 0;
var images = {
	over: new Image(),
	under: new Image()
};

// when the dom has loaded, invoke the preparations funktions,
//that is a "constructor" for the game

$(document).ready(function() {

	canvas = document.getElementById("metal_slug");

	window.addEventListener('keyup',   function(event) {
		Key.onKeyup(event);
		downNow = false;
		window.s.idle(window.s.getCurrentDirection());
	},   false);

	window.addEventListener('keydown', function(event) {
		Key.onKeydown(event);
		if(downNow == false) // removes the "multiclicks"
		{
			// if(window.s.animation.x > canvas.width*.25 && Key.isDown(Key.RIGHT)) {
	  		// 	console.log("move map");
	  		// 	map.background.regX += s.animation.vX;
	  		// }else if(window.s.animation.x < canvas.width*.05 && Key.isDown(Key.LEFT)){
	  		// 	map.background.regX -= s.animation.vX;
	  		// }else {
	  		// 	s.update();
	  		// }
	  		// map.update(map.background.regX, map.background.regY);
			if(Key.isDown(Key.D)) // <-
			{
	//			console.log(map);
				window.s.run(90);
			}
			else if(Key.isDown(Key.A)) // ->
			{
				window.s.run(-90);
			}
			else if(Key.isDown(Key.SPACE))
			{
				window.s.idle(90);
				console.log("SPACE");
			}
			downNow = true;
		}

	},	false);

	canvas.onclick = function(){
		console.log("click");

		window.s.shoot();
	};



		/**
	* This starts the game, sets the fps and tells the brobrwser to use RAF
	*
	*/
	function startGame()
	{

		window.s = new Soldat(stage);
		window.s.init(images.under,images.over);

		stage.addChild(window.s.returnSoldier());
		console.log("added child");

		createjs.Ticker.addListener(tick);
	    createjs.Ticker.useRAF = true;
	    createjs.Ticker.setFPS(90);
	}
	/**
	*	Function that starts the game when everything has loaded
	*	not used know, because we only have one soldat
	*/
	function gameLoader(e)
	{
		numberOfImages++;
		console.log(numberOfImages);
		if(numberOfImages == totalNumberOfImages)
		{
			console.log("we will start");
			startGame();
		}
	}
	/*
	*	Invoked when theres an error with the sprite images
	*/
	function handleImageError(e)
	{
		console.log("Image error somewhere");
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
	/*
	*	This is the game loop that runs in x fps. 
	*/
	function tick() {
	  		
	  		// update soldier
	  		// s.update();

	  		window.s.update();
	  		if(s.mode == "run"){
	  		//	s.update();

	  			// if(s.direction == 90 && s.animation.x > canvas.width*.25) {
	  			// 	// Right movements
	  			// 	if(map.background.regX + canvas.width*.5 < map.iMap.width)
			  	// 		map.background.regX += s.animation.vX;
			  	// 	else{
			  	// 		if(s.animation.x < canvas.width*.5 - 16)
			  	// 			s.update();
			  	// 	}
	  			// }else if(s.direction == -90 && s.animation.x < canvas.width*.05){
	  			// 	// Left movements
	  			// 	if(map.background.regX > 0)
		  		// 		map.background.regX -= s.animation.vX;
		  		// 	else{
		  		// 		if(s.animation.x > 16)
		  		// 			s.update();
		  		// 	}
	  			// }else {
	  			// 	s.update();
	  			// }
	  		}

	  		// update stage (container)
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

		// Map(stage, "mission1");
//		window.map = new Map(stage, "mission1");
		//window.map.init
	//	window.map = new Map(stage, "mission1");
		
		

//		map.init()
			
		//	stage.scaleX = 2;
		//	stage.scaleY = 2;

		images.over.src = "img/over.png";
		images.over.onerror = handleImageError;
		images.over.onload  = gameLoader;

		images.under.src = "img/under.png";
		images.under.onerror = handleImageError;
		images.under.onload  = gameLoader;
		//startGame();
	}


 	preparations();
});
