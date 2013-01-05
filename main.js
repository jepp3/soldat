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

function handleImageLoad(e)
{
	numberOfImages++;

	if(numberOfImages == totalNumberOfImages)
	{
		startGame();
	}
}
function handleImageError(e)
{
	console.log("Image error somewhere");
}
function resetScreen()
{
	stage.removeAllChildren();
  	createjs.Ticker.removeAllListeners();
  	stage.update();
}
function tick() {
  		// check if we are runing outside the canvas
  		
  		window.s.update();
        stage.update();
}
function preparations()
{
	canvas = document.getElementById("testCanvas");

	stage = new createjs.Stage(canvas);
	screen_width = canvas.width;
	screen_height = canvas.height;

	window.s = new Soldat("soldat1");
	window.s.init();
	
}
function startGame()
{
	createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(90);

    window.s.setMode("idle");
}



// when the dom has loaded, invoke the preparations funktions,
//that is a "constructor" for the game

$(document).ready(function() {
 	preparations();
});
