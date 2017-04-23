"use strict";
(function(){
	function Explosion() {
		Entity.call(this);
		this.duration = 0.4 * game.SEC;
	}
	Explosion.prototype = Object.create(Entity.prototype);

	Explosion.prototype.init = function() {
		this.targetRadius = 30;
		this.timer = 0;
		this.radius = 0;
	};

	Explosion.prototype.update = function() {
		this.timer++;
		this.radius = (this.timer / this.duration) * this.targetRadius;
	};

	window.Explosion = Explosion;
})();