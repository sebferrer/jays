function ImgBank() {
	this.buffer = new Array();
	this.pic = new Object();
	this.error = 0;
	this.unload = 0;
	this.loaded = 0;
	this.nextLoad = 0;
}
ImgBank.prototype = {
		preload: function(imglist,callback) {
			this.unload = imglist.length;
			this.error = 0;
			this.loaded = 0;
			this.nextLoad = 0;
			this.buffer = imglist;
						
			var self = this;
			var timer = function() {
				if(self.loaded == self.unload) {	
					callback();
				} else if(self.loaded > self.nextLoad) {	
					self.nextLoad++;
					self.loadimg();
					setTimeout(timer,10);
				} else {
					setTimeout(timer,10);
				}
			}
			this.loadimg();
			setTimeout(timer,10);
		
		},
		
		loadimg: function() {	
			var ref = this.buffer[this.nextLoad];
			var img = new Image();
				img.src = ref;
			var self = this;
			
			img.onload = function() {
				var canvas = document.createElement("canvas");
					canvas.height = img.height;
					canvas.width = img.width;
				var ctx = canvas.getContext("2d");
					ctx.drawImage(img,0,0);
					
				self.pic[ref] = canvas;
				self.loaded++;
			};
			
			img.onerror = function() {
				self.loaded++;
				self.error++;			
			};
			
		}
}
var list = ["assets/img/tiles.png"];
var bank = new ImgBank();