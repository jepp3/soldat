var canvas; 
var stage;
var scrren_width;
var screen_height;
var bmpAnimation;

var imgSoldier  =new Image();

// load the image and get the canvas element we want to work on
function init() {
    canvas = document.getElementById("myCanvas");

    imgSoldier.onload=handleImageLoad;
    imgSoldier.onerror = handleImageError;
    imgSoldier.src = "../img/MonsterARun.png";
}
// ad är stage och vad är ticker?
function reset() {
    stage.removeAllChildren();
    createjs.Ticker.removeAllListeners();
    stage.update();
}
// start the game, this function is invoked by the onload in the init function
function handleImageLoad(e) {
    startGame();
}

function startGame() {

     /*  A stage is the root level Container for a display list.
         Each time its tick method is called, it will render its
         display list to its target canvas.
    */ 

    // create a new stage and point at our canvas
    stage = new createjs.Stage(canvas);

    // get the canvas dimention
    screen_height =canvas.height;
    screen_width = canvas.width;


    /*
        Encapsulates the properties and methods associated with a sprite sheet. A sprite sheet is a series of images (usually animation frames) combined into a larger image (or images). For example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across by 2 high).
        The data passed to the SpriteSheet constructor defines three critical pieces of information:

        The image or images to use.
        The positions of individual image frames. This data can be represented in one of two ways: As a regular grid of sequential, equal-sized frames, or as individually defined, variable sized frames arranged in an irregular (non-sequential) fashion.
        Likewise, animations can be represented in two ways: As a series of sequential frames, defined by a start and end frame [0,3], or as a list of frames [0,1,2,3]. 
    */

    // create a spritesheet and assign the asociated data.
    var spriteSheet = new createjs.SpriteSheet({

        images: [imgSoldier], // an array of images (we only use one at the moment)
        frames: {width: 64, height:64,regX:32,regY:32}, // the frame dimention
        animations: {
            walk: [0,9,"walk"]
        }
    });


    // create a BitmapAnimation instance to display and play back the sprite sheet:
    bmpAnimation = new createjs.BitmapAnimation(spriteSheet);

    // start playing the first sequence:
    bmpAnimation.gotoAndPlay("walk");   //animate

    // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
    // of animated rats if you disabled the shadow.


    bmpAnimation.name = "monster1";
    bmpAnimation.direction = 90;
    bmpAnimation.vX = 4;
    bmpAnimation.x = 16;
    bmpAnimation.y = 32;
        
    // have each monster start at a specific frame
    bmpAnimation.currentFrame = 0;
    stage.addChild(bmpAnimation);
        
    // we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
    createjs.Ticker.addListener(window);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}
//called if there is an error loading the image (usually due to a 404)
function handleImageError(e) {
    console.log("Error Loading Image : " + e.target.src);

}


function tick() {
    // Hit testing the screen width, otherwise our sprite would disappear
    if (bmpAnimation.x >= screen_width - 16) {
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bmpAnimation.direction = -90;
    }

    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bmpAnimation.direction = 90;
    }

    // Moving the sprite based on the direction & the speed
    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
    }

    // update the stage:
    stage.update();
}
