/**
* Moving soldat
* is printed with canvas/sprites 
* has methods as move 
**/
"use strict";

var downNow = false, canvas, stage, numberOfImages = 0, totalNumberOfImages = 1,
screen_width =0, screen_height = 0;


window.addEventListener('keyup',   function(event) {
	Key.onKeyup(event);
	downNow = false;
	window.s.setMode("idle");
},   false);

window.addEventListener('keydown', function(event) {
	Key.onKeydown(event);
	if(downNow == false) // removes the "multiclicks"
	{
		
		if(Key.isDown(Key.RIGHT)) // <-
		{
			window.s.setMode("run");
			window.s.setDirection(90);
		}
		else if(Key.isDown(Key.LEFT)) // ->
		{
			window.s.setMode("run");
			window.s.setDirection(-90);
		}
		else if(Key.isDown(Key.SPACE))
		{
			console.log("SPACE");
		}
		downNow = true;
	}
	
},	false);

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
  		window.s.update();
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
	canvas = document.getElementById("testCanvas");

	stage = new createjs.Stage(canvas);
	screen_width = canvas.width;
	screen_height = canvas.height;

	window.s = new Soldat("soldat1");
	window.s.init();
	
}
/**
* This starts the game, sets the fps and tells the brobrwser to use RAF
*
*/
function startGame()
{
	createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(90);


    // so that the solider is not running
    window.s.setMode("idle");
}



// when the dom has loaded, invoke the preparations funktions,
//that is a "constructor" for the game

$(document).ready(function() {
 	preparations();
});
