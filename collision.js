/*
The MIT License

Copyright (c) 2012 Olaf Horstmann, indiegamr.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(){
	function Collision(){
		this.collisionCanvas = document.createElement('canvas'),
		this.collisionCtx = this.collisionCanvas.getContext('2d'),

		this.collisionCanvas2 = document.createElement('canvas'),
		this.collisionCtx2 = this.collisionCanvas2.getContext('2d');

		this.collisionCtx.save();
		this.collisionCtx2.save();

		this.cachedBAFrames = [];
	};

	Collision.prototype = {
		checkCollision: function(object1, object2, alpha){
			var intersection = {},
				imageData1,
				imageData2,
				boundsObj1,
				boundsObj2,
				rect1 = {},
				rect2 = {};

			// Get the bounderys for the objects
			boundsObj1 = this.getBounds.call(this,object1);
			boundsObj2 = this.getBounds.call(this,object2);

			// Calculate the center of the objects
			rect1.centerX = boundsObj1.x + (rect1.hw = (boundsObj1.width/2));
			rect1.centerY = boundsObj1.y + (rect1.hh = (boundsObj1.height/2));
			rect2.centerX = boundsObj2.x + (rect2.hw = (boundsObj2.width/2));
			rect2.centerY = boundsObj2.y + (rect2.hh = (boundsObj2.height/2));

			// Calculate the center of the intersection
			intersection.x = Math.abs(rect1.centerX - rect2.centerX) - (rect1.hw + rect2.hw);
			intersection.y = Math.abs(rect1.centerY - rect2.centerY) - (rect1.hh + rect2.hh);

			// Set the intersection if the objects intersect
			if(intersection.x<0 && intersection.y<0){
				intersection.width = Math.min(Math.min(boundsObj1.width,boundsObj2.width),-intersection.x);
				intersection.height = Math.min(Math.min(boundsObj1.width,boundsObj2.width),-intersection.y);
				intersection.x = Math.max(boundsObj1.x,boundsObj2.x);
				intersection.y = Math.max(boundsObj1.y,boundsObj2.y);
			}else{
				return false;
			}

			// Get the lowest alpha value (least transparent)
			alpha = alpha || 0;
			alpha = Math.min(0.9999,alpha);

			// Set the canvas size
			this.collisionCanvas.width = this.collisionCanvas2.width = intersection.width;
			this.collisionCanvas.height = this.collisionCanvas2.height = intersection.height;

			// Get the intersecting image-part from the bitmaps
			imageData1 = this._intersectingImagePart.call(this, intersection, object1, this.collisionCtx);
			imageData2 = this._intersectingImagePart.call(this, intersection, object2, this.collisionCtx2);

			// Compair alpha values for collision
			pixelIntersection = this._intersectingAlphaPart.call(this, imageData1,imageData2,intersection.width,intersection.height,alpha)


			if(pixelIntersection){
				pixelIntersection.x += intersection.x;
			    pixelIntersection.x2 += intersection.x;
			    pixelIntersection.y += intersection.y;
			    pixelIntersection.y2 += intersection.y;
			}

			return pixelIntersection;
		},
		getBounds: function(object){
			var bounds={x:Infinity,y:Infinity,width:0,height:0};

			if(object instanceof createjs.Container){
				var children = object.children, l=children.length, cbounds, c;

				for(c=0; c<l; c++){
					cbounds = this.getBounds(this,children[c]);
					if(cbounds.x < bounds.x) bounds.x = cbounds.x;
					if(cbounds.y < bounds.y) bounds.y = cbounds.y;
					if(cbounds.width > bounds.width) bounds.width = cbounds.width;
					if(cbounds.height > bounds.height) bounds.height = cbounds.height;
				}
			}else{
				var gp, gp2, gp3, gp4, imgr;

				if(object instanceof createjs.Bitmap){
					imgr = object.image;
				}else if(object instanceof createjs.BitmapAnimation){
					if(object.spriteSheet._frames && object.spriteSheet._frames[object.currentFrame] && object.spriteSheet._frames[object.currentFrame].image){
						imgr =  object.spriteSheet.getFrame(object.currentFrame).rect;
					}else{
						return bounds;
					}
				}else{
					return bounds;
				}

				gp = object.localToGlobal(0,0);
				gp2 = object.localToGlobal(imgr.width,imgr.height);
				gp3 = object.localToGlobal(imgr.width,0);
				gp4 = object.localToGlobal(0,imgr.height);

				bounds.x = Math.min(Math.min(Math.min(gp.x,gp2.x),gp3.x),gp4.x);
				bounds.y = Math.min(Math.min(Math.min(gp.y,gp2.y),gp3.y),gp4.y);
				bounds.width = Math.max(Math.max(Math.max(gp.x,gp2.x),gp3.x),gp4.x) - bounds.x;
				bounds.height = Math.max(Math.max(Math.max(gp.y,gp2.y),gp3.y),gp4.y) - bounds.y;
			}
			return bounds;
		},
		_intersectingImagePart: function(intersection, object, ctx){
			var bl, image, frame;

			if(object instanceof createjs.Bitmap){
				image = object.image;
			}else if(object instanceof createjs.BitmapAnimation){
				frame = object.currentFrame+object.spriteSheet.getFrame(object.currentFrame).image.src;
				if(this.cachedBAFrames[frame]){
					image = this.cachedBAFrames[frame];
				}else{
					this.cachedBAFrames[frame] = image = createjs.SpriteSheetUtils.extractFrame(object.spriteSheet,object.currentFrame);
				}
			}


			bl = object.globalToLocal(intersection.x, intersection.y);
			ctx.restore();
			ctx.clearRect(0,0,intersection.width,intersection.height);

			ctx.translate(-bl.x, -bl.y);
			ctx.drawImage(image,0,0,image.width,image.height);
			return ctx.getImageData(0,0,intersection.width,intersection.height).data;
		},
		_intersectingAlphaPart: function(imageData1, imageData2, width, height, alpha){
			var alpha1, alpha2, x, y, offset=3
				,pixelRect = {x:Infinity,y:Infinity,x2:-Infinity,y2:-Infinity};


			for(y=0; y<height; ++y){
				for(x=0; x<width; ++x){
					alpha1 = imageData1.length > offset+1 ? imageData1[offset] / 255 : 0;
					alpha2 = imageData2.length > offset+1 ? imageData2[offset] / 255 : 0;

					if(alpha1 > alpha && alpha2 > alpha){

						return {x:x,y:y,width:1,height:1};
					}
					offset += 4;
				}
			}

			// if( pixelRect.x != Infinity) {
			// 	pixelRect.width = pixelRect.x2 - pixelRect.x+1;
			// 	pixelRect.height = pixelRect.y2 - pixelRect.y+1;
			// 	return pixelRect;
			// }
			return null;
		},
		grid: function(player, direction){
			if(direction == DIRECTION.RIGHT && player.x > canvas.width/2){
				// Right movements
				if(Map.background.regX + canvas.width < Map.iMap.background.width){
					Map.background.regX += player.vX;
					Map.platforms.getChildAt(0).regX += player.vX;
					return true;
				}else{
		  			if(player.x < canvas.width - 16){
		  				console.log(player.x)
		  				return false;
		  			}
		  			return true;
		  		}
			}else if(direction == DIRECTION.LEFT && player.x < canvas.width/10){
				// Left movements
  				if(Map.background.regX > 0){
	  				Map.background.regX -= player.vX;
	  				Map.platforms.getChildAt(0).regX -= player.vX;
	  				return true;
	  			}
	  			else{
	  				if(player.x > 16)
	  					return true;
	  			}

			}

			return false;
		},
		platform: function(character, platforms){

			for(var i=0; i<platforms.getNumChildren(); i++)
			{
				if(this.checkCollision(character.getChildAt(0), platforms.getChildAt(i))){
					return true;
				}
			}
			return false;
		}
	}
	window.Collision = new Collision();
})(window)