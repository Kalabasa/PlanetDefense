"use strict";
(function() {
	function Enemy() {
		Entity.call(this);
	};
	Enemy.prototype = Object.create(Entity.prototype);

	Enemy.prototype.init = function() {
		this.speed = 30 * game.PER_SEC;
	};

	Enemy.prototype.update = function() {
		var dir = this.pos.clone();
		util.normalize(dir);
		util.scale(dir, -this.speed);
		util.add(this.pos, dir);
	};

	window.Enemy = Enemy;
})();