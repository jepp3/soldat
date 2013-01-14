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
			boundsObj1 = this.getBounds(object1);
			boundsObj2 = this.getBounds(object2);

			// Calculate the center of the objects
			rect1 = this.getCenter(boundsObj1);
			rect2 = this.getCenter(boundsObj2);
// console.log(rect1)
			// rect1.centerX = boundsObj1.x + (rect1.hw = (boundsObj1.width/2));
			// rect1.centerY = boundsObj1.y + (rect1.hh = (boundsObj1.height/2));
			// rect2.centerX = boundsObj2.x + (rect2.hw = (boundsObj2.width/2));
			// rect2.centerY = boundsObj2.y + (rect2.hh = (boundsObj2.height/2));

			// Calculate the center of the intersection
			intersection = this.getIntersect(rect1, rect2);
			// intersection.x = Math.abs(rect1.centerX - rect2.centerX) - (rect1.hw + rect2.hw);
			// intersection.y = Math.abs(rect1.centerY - rect2.centerY) - (rect1.hh + rect2.hh);
// console.log(intersection);
			// Set the intersection if the objects intersect
			if(intersection.x<0 && intersection.y<0){
				intersection.width = Math.min(Math.min(boundsObj1.width,boundsObj2.width),-intersection.x);
				intersection.height = Math.min(Math.min(boundsObj1.width,boundsObj2.width),-intersection.y);
				intersection.x = Math.max(boundsObj1.x,boundsObj2.x);
				intersection.y = Math.max(boundsObj1.y,boundsObj2.y);
			}else{
				return false;
			}

			// Get the intersected bitmap from containers
			if(object1 instanceof createjs.Container) {
				object1 = this.getBitmap(object1, intersection);
			}
			if(object2 instanceof createjs.Container) {
				object2 = this.getBitmap(object2, intersection);
			}

			// Get the lowest alpha value (least transparent)
			alpha = alpha || 0;
			alpha = Math.min(0.9999,alpha);

			// Set the canvas size
			this.collisionCanvas.width = this.collisionCanvas2.width = intersection.width;
			this.collisionCanvas.height = this.collisionCanvas2.height = intersection.height;

			// Get the intersecting image-part from the bitmaps
			imageData1 = this._intersectingImagePart(intersection, object1, this.collisionCtx);
			imageData2 = this._intersectingImagePart(intersection, object2, this.collisionCtx2);

			// Compair alpha values for collision
			pixelIntersection = this._intersectingAlphaPart.call(this, imageData1,imageData2,intersection.width,intersection.height,alpha)


			if(pixelIntersection){
				pixelIntersection.x += intersection.x;
			    pixelIntersection.x2 += intersection.x;
			    pixelIntersection.y += intersection.y;
			    pixelIntersection.y2 += intersection.y;
// console.log(pixelIntersection)
			    return pixelIntersection;
			}

			return false;
		},
		getCenter: function(boundsObj){
			var rect = {};
			// console.log(boundsObj)
			// Calculate the center of the objects
			rect.centerX = boundsObj.x + (rect.hw = (boundsObj.width/2));
			rect.centerY = boundsObj.y + (rect.hh = (boundsObj.height/2));

			return rect;
		},
		getIntersect: function(rect1, rect2){
			var intersection = {};

			// Calculate the center of the intersection
			intersection.x = Math.abs(rect1.centerX - rect2.centerX) - (rect1.hw + rect2.hw);
			intersection.y = Math.abs(rect1.centerY - rect2.centerY) - (rect1.hh + rect2.hh);

			// if(intersection.x<0 && intersection.y<0)
			return intersection;
			// return null;
		},
		getBitmap: function(object, intersection){
			var objectBounds1;

			for(i in object.children){
				objectBounds = this.getBounds(object.getChildAt(i));
				return object.getChildAt(i);
		}
			return false;
		},
		getBounds: function(object){
			var bounds={x:Infinity,y:Infinity,width:0,height:0};

			if(object instanceof createjs.Container){
				var children = object.children, l=children.length, cbounds, c;

				for(c=0; c<l; c++){
					cbounds = this.getBounds(children[c]);
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
				}
				else{
					// console.log("something else");
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
// console.log()
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
			var y = 0;
// console.log(Map.backgrounds.getChildAt(2).regX)
			if(direction == DIRECTION.RIGHT && player.x > canvas.width/2 + Math.abs(stage.x)){
				// Right movements
				if(Math.abs(stage.x) + canvas.width < Map.images.bitmaps.background.width){
					// console.log(stage.x - canvas.width )
					// console.log(Map.images.bitmaps.background.width)
					// Map.background.regX += player.vX;
					// Map.platforms.getChildAt(0).regX += player.vX;
					// if(player.vX > 0) console.log(player.vX)
					if(Math.abs(stage.x) > 3200 && Math.abs(stage.x) < 3651){
						y = player.vX/4;
					}
					Map.update(-player.vX, y);
					// return true;
				}else{
		  			if(player.x < Math.abs(stage.x) + canvas.width - 16){
		  				return false;
		  			}
		  			return true;
		  		}
			}else if(direction == DIRECTION.LEFT && player.x +stage.x < canvas.width/10){
				// Left movements
				// console.log(stage.x)
  				if(Math.abs(stage.x) > 0){
  					// if(Map.backgrounds.getChildAt(2).regX + canvas.width < 3951 && Map.backgrounds.getChildAt(2).regX + canvas.width > 3500){
  					if(Math.abs(stage.x) < 3651 && Math.abs(stage.x) > 3200){
  						y = -player.vX/4;
  					}
					Map.update(player.vX, y);
	  				// Map.background.regX -= player.vX;
	  				// Map.platforms.getChildAt(0).regX -= player.vX;
	  				// return ;
	  			}
	  			else{
	  				if(player.x + Math.abs(stage.x) > 16)
	  					return true;
	  			}

			}

			return false;
		},
		platform: function(object, platforms){
			// console.log(character);
			var	obj = object.clone(true),
				hitArea,
				bitmap,
				collision = false;
				// hitarea = boundsChar;
				// hitarea.width -=10;
				// hitarea.height = 5;
				// hitarea.x += 5;
				// hitarea.y -= 26;
				// bitmap = this._intersectingImagePart.call(this, hitarea, boundsChar, this.collisionCtx);
			// obj.x = object.vX || object.x;//window.s.soldier.vX;
			// obj.y = object.vX || object.x;//window.s.weight.y -0.5;
// console.log()
			var compare = object;
			if(object instanceof createjs.Container)
			{
				compare =  object.getChildAt(0);
			}
			var boundsChar = this.getBounds.call(this,compare),
				hitArea,
				bitmap;

				// hitarea = boundsChar;
				// hitarea.width -=10;
				// hitarea.height = 5;
				// hitarea.x += 5;
				// hitarea.y -= 26;
				// bitmap = this._intersectingImagePart.call(this, hitarea, boundsChar, this.collisionCtx);


			// console.log(bitmap)
			for(var i=0; i<platforms.getNumChildren(); i++)
			{
// <<<<<<< HEAD
				if(collision = this.checkCollision(compare, platforms.getChildAt(i))){
					// console.log(collision)
					return collision;
// =======
// 				if(this.checkCollision(compare, platforms.getChildAt(i))){
// 					return true;
// >>>>>>> fa58880e13bbbb3017277f93903d460219c9cc7a
				}
			}
			// console.log(collision)
			return collision;
		}
	}
	window.Collision = new Collision();
})(window)
