(function(){
	function Map(){
		this.stage = null;
		this.iMap = {};//new Image();
		this.iLoaded = 0;
		this.ready = false;
		this.spriteSheet = null;
		this.animation = null;
		this.pressing = false;
		this.images = {};
		this.platforms = new createjs.Container();
	};

	Map.objects = {};

	Map.prototype = {
		init: function(stage, map){
			this.stage = stage;
			this.load(map);

			//Platforms
			var platform = new Image();
			platform.src = this.images.platform;
			platform.onerror = handleImageError;
			platform.onload = this.platforms.addChild(new createjs.Bitmap(platform));

			//Background
			this.iMap.background = new Image();
			this.iMap.background.src = this.images.background;
			this.iMap.background.onerror = handleImageError;
		    this.iMap.background.onload = this.build.call(this);

		 	// this.build.call(this);
		},
		build: function(event){
			this.background = new createjs.Bitmap(this.iMap.background);

			stage.addChild(this.platforms);
			stage.addChild(this.background);
		},
		update: function(x,y){
			this.background.regX = x;
			this.background.regY = y;
		},
		load: function(mission) {
			console.log(mission)
			switch(mission){
			case "mission1":  
						this.images.background = "img/mission1/mission1.png",
						this.images.platform = "img/mission1/mission1_platform.png"
			}
			// return images;
		}
	}

	window.Map = new Map();
})(window)