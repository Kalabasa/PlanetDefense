"use strict";
(function(){
	window.util = {

		distance2: function(a, b) {
			var x = b.x - a.x;
			var y = b.y - a.y;
			return x * x + y * y;
		},

		distance: function(a, b) {
			return Math.sqrt(this.distance2(a, b));
		},

		length2: function(a) {
			return a.x * a.x + a.y * a.y;
		},

		length: function(a) {
			return Math.sqrt(this.length2(a));
		},
	
		// a += b;
		add: function(a, b) {
			a.x += b.x;
			a.y += b.y;
		},
	
		// a -= b;
		sub: function(a, b) {
			a.x -= b.x;
			a.y -= b.y;
		},

		// a = sa
		scale: function(a, s) {
			a.x *= s;
			a.y *= s;
		},

		normalize: function(a) {
			var d = this.length(a);
			if (d === 0) {
				a.x = 1;
				a.y = 0;
			} else {
				this.scale(a, 1 / d);
			}
		},

		angle: function(a, b) {
			var x = b.x - a.x;
			var y = b.y - a.y;
			return Math.atan2(y, x);
		},

		deltaAngle: function(a, b) {
			var d = b - a;
			while (d < -Math.PI) { 
				d += 2 * Math.PI;
			}
			while (d > Math.PI) { 
				d -= 2 * Math.PI;
			}
			return d;
		},

		animationFrames: function(sourceTexture, x, y, w, h, framesCount, rowsCount) {
			if (rowsCount === undefined) rowsCount = 1;
			var frames = [];
			var ix;
			var iy = y;
			for (var j = 0; j < rowsCount; j++) {
				ix = x;
				for (var i = 0; i < framesCount; i++) {
					frames.push(new PIXI.Texture(sourceTexture, new PIXI.Rectangle(ix, iy, w, h)));
					ix += w;
				}
				iy += h;
			}
			return frames;
		},
	};
})();