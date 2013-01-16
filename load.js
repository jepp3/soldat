/**
*	Function class that starts the game when everything has loaded
*	not used know, because we only have one soldat
*/
(function(){
	var totalLoaded = 0;

	Load = {

		_progress: function(event){

		},

		_complete: function(event){
			totalLoaded++;
			window.label.loading(parseInt((totalLoaded/manifest.length)*100));
			stage.update();
			if(manifest.length == totalLoaded){
				
				window.label.remove();
				createjs.SoundJS.play("ms");
				startGame();
			}
			window.label.clear();
		},

		/*
		*	Invoked when theres an error with the sprite images
		*/
		_error: function(event)
		{
			console.log("Image error somewhere");
		},

		file: function(event){
			switch(event.type){
				case createjs.PreloadJS.IMAGE:
					var img = new Image();
					img.src = event.src;
					img.onload = this.onComplete;
					img.onerror = this.onError;
					window[event.id] = img;
				break;

				case createjs.PreloadJS.SOUND:
					this.onComplete();
				break;
			}
		}
	};

	return Load;
})(window)
