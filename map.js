(function(){
	function Map(){
		this.iMap = {};
		this.iLoaded = 0;
		this.ready = false;
		this.images = {};
		this.width = 0;
		this.height = 0;

		this.platforms = new createjs.Container();
		this.far_horizons = new createjs.Container();
	    this.horizons = new createjs.Container();
	    this.backgrounds = new createjs.Container();
	    this.forground = new createjs.Container();
	    // this.background = new Image();
	};

	Map.objects = {};

	Map.prototype = {
		init: function(stage, map){
			this.stage = stage;
			this.load(map);

			// Bitmaps
			for(i in this.images.bitmaps){

				this.addToLayer(new createjs.Bitmap(this.images.bitmaps[i].img),
						this.images.bitmaps[i].layer,
						i,
						this.images.bitmaps[i].position);
			}

		    // Animations
		    for(i in this.images.animations){
		    	animation = new createjs.SpriteSheet({
		    		images: [this.images.animations[i].img],
		    		frames: this.images.animations[i].frames,
		    		animations: this.images.animations[i].animations,
		    	});

		    	// animation.onerror = handleImageError;
		    	this.addToLayer(new createjs.BitmapAnimation(animation),
		    			this.images.animations[i].layer,
		    			i,
		    			this.images.animations[i].position);
		    }

		 	this.build.call(this);
		},
		addToLayer: function(object, layer, name, position){

			if(object instanceof createjs.BitmapAnimation){
				object.gotoAndPlay("idle");
		    	object.regX = this.images.animations[name].offset.x;
		    	object.regY = this.images.animations[name].offset.y;
			}else{
				object.regX = this.images.bitmaps[name].offset.x;
		    	object.regY = this.images.bitmaps[name].offset.y
			}

			switch(layer){
				case "platform":
					if(typeof position === "number")
						this.platforms.addChildAt(object, position);
					else
						this.platforms.addChild(object);
					break;
				case "far_horizon":
					if(typeof position === "number")
						this.far_horizons.addChildAt(object, position);
					else
						this.far_horizons.addChild(object);
					break;
				case "horizon":
					if(typeof position === "number")
						this.horizons.addChildAt(object, position);
					else
						this.horizons.addChild(object);
					break;
				case "background":
					if(typeof position === "number")
						this.backgrounds.addChildAt(object, position);
					else
						this.backgrounds.addChild(object);
					break;
				case "forground":
					if(typeof position === "number")
						this.forground.addChildAt(object, position);
					else
						this.forground.addChild(object);
					break;
			}
		},
		build: function(event){
			stage.addChild(this.platforms);
			stage.addChild(this.far_horizons)
			stage.addChild(this.horizons);
			stage.addChild(this.backgrounds);
		},
		addForgorund: function(){
			stage.addChild(this.forground)
		},
		update: function(x,y){
			var i,
				y = y || 0;

			if(Math.abs(stage.x) > 3200 && Math.abs(stage.x) < 3651){
				y = y/4;
			}else{
				y = 0;
			}

			stage.x += x;
			stage.y += y;


			if(Math.abs(stage.x) > 1700 ){
				 for(i=0; i<this.horizons.getNumChildren(); i++){
					this.horizons.getChildAt(i).regX += x*.2;
				}
			}

			if(Math.abs(stage.x) > 2700) {
				for(i=0; i<this.far_horizons.getNumChildren(); i++){
					this.far_horizons.getChildAt(i).regX += x*.7;
					this.far_horizons.getChildAt(i).regY += y*.1;
				}
			}
		},
		load: function(mission) {

			switch(mission){
			case "mission1":
						this.width = 4153,
						this.height = 240,
						this.images.bitmaps = {
							platform:{
								img:window["background_platform"],
								offset:{x:0,y:17},
								layer:"platform"
							},
							background:{
								img:window["background"],
								offset:{x:0,y:17},
								layer:"background",
							},
							forest:{
								img:window["horizon_forest"],

								offset:{x:-1900, y:38},

								layer:"horizon",
							}
						};
						this.images.animations = {
							boat:{
								img:window["horizon_boat"],
								frames:{width:319, height:250},
								animations:{
									idle: [0,7,"idle",10]
								},
								offset:{x:-2850, y:	60},
								layer:"far_horizon"
							},
							horizon_waterfall:{
								img:window["horizon_waterfall"],
								frames:{width:278 , height:192},
								animations:{
					    			idle: [0,6,"idle",10]
					    		},
								offset:{x:-3747, y:129},
								layer:"background",
								position:0
							},
							waterfall:{
								img:window["waterfall"],
								frames:{width:431 , height:271},
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-3337, y:81},
								layer:"background"
							},
							airplane:{
								img:window["airplane"],
								frames:{width:833 , height:305},
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-3317, y:81},
								layer:"forground"
							},
							water_left:{
								img:window["water"],
								frames:[[0,17,902,32,0],
										[0,68,902,32,0],
										[0,119,902,32,0],
										[0,170,902,32,0],
										[0,221,902,32,0],
										[0,272,902,32,0],
										[0,323,902,32,0],
										[0,374,902,32,0]],//{width:902 , height:51},
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-1860, y:-190},
								layer:"forground"
							},
							background_water_left:{
								img:window["water"],
								frames:[[0,0,902,16,0],
										[0,51,902,16,0],
										[0,102,902,16,0],
										[0,153,902,16,0],
										[0,204,902,16,0],
										[0,255,902,16,0],
										[0,306,902,16,0],
										[0,357,902,16,0]],//{width:902 , height:51},
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-1860, y:-174},
								layer:"background"
							},
							water_middle:{
								img:window["water"],
								frames:[[903,17,146,32,0],
										[903,68,146,32,0],
										[903,119,146,32,0],
										[903,170,146,32,0],
										[903,221,146,32,0],
										[903,272,146,32,0],
										[903,323,146,32,0],
										[903,374,146,32,0]],
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-2761, y:-190},
								layer:"forground"
							},
							background_water_middle:{
								img:window["water"],
								frames:[[903,0,146,16,0],
										[903,51,146,16,0],
										[903,102,146,16,0],
										[903,153,146,16,0],
										[903,204,146,16,0],
										[903,255,146,16,0],
										[903,306,146,16,0],
										[903,357,146,16,0]],
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-2761, y:-174},
								layer:"background"
							},
							water_right:{
								img:window["water"],
								frames:[[1050,17,603,32,0],
										[1050,68,603,32,0],
										[1050,119,603,32,0],
										[1050,170,603,32,0],
										[1050,221,603,32,0],
										[1050,272,603,32,0],
										[1050,323,603,32,0],
										[1050,374,603,32,0]],
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-2907, y:-190},
								layer:"forground",
								position:0
							},
							background_water_right:{
								img:window["water"],
								frames:[[1050,0,603,16,0],
										[1050,51,603,16,0],
										[1050,102,603,16,0],
										[1050,153,603,16,0],
										[1050,204,603,16,0],
										[1050,255,603,16,0],
										[1050,306,603,16,0],
										[1050,357,603,16,0]],
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-2907, y:-175},
								layer:"background",
								position:0
							},
							background_water_farright:{
								img:window["water"],
								frames:[[1082,0,571,16,0],
										[1082,51,571,16,0],
										[1082,102,571,16,0],
										[1082,153,571,16,0],
										[1082,204,571,16,0],
										[1082,255,571,16,0],
										[1082,306,571,16,0],
										[1082,357,571,16,0]],
								animations:{
					    			idle: [0,7,"idle",10]
					    		},
								offset:{x:-3195, y:-174},
								layer:"background"
							}
						};
			}
			// return images;
		},
		getManifest: function(mission){
			switch(mission){
				case "mission1":
					return [
						{src:"img/mission1/background_platform.png", id:"background_platform"}
						,{src:"img/mission1/background.png", id:"background"}
						,{src:"img/mission1/horizon_forest.png", id:"horizon_forest"}
						,{src:"img/mission1/horizon_boat.jpg", id:"horizon_boat"}
						,{src:"img/mission1/horizon_waterfall.jpg", id:"horizon_waterfall"}
						,{src:"img/mission1/waterfall.png", id:"waterfall"}
						,{src:"img/mission1/airplane.png", id:"airplane"}
						,{src:"img/mission1/water.png", id:"water"}
					]
				break;
			}
		}

	}

	window.Map = new Map();
})(window)
