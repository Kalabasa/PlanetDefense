"use strict";
(function(){
	function Missile() {
		Entity.call(this);
		this.target = new PIXI.Point();
		this.speed = 80 * game.PER_SEC;
	}
	Missile.prototype = Object.create(Entity.prototype);

	Missile.prototype.update = function() {
		var dir = this.getTargetDelta();
		util.normalize(dir);
		util.scale(dir, this.speed);
		util.add(this.pos, dir);
	};

	Missile.prototype.getTargetDelta = function() {
		var delta = this.target.clone();
		util.sub(delta, this.pos);
		return delta;
	};

	window.Missile = Missile;
})();