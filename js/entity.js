"use strict";
(function() {
	function Entity() {
		this.pos = new PIXI.Point();
		this.view = null;
	};

	Entity.prototype.init = function() {
		// override
	};

	Entity.prototype.update = function() {
		// override
	};

	Entity.prototype.destroy = function() {
		if (this.view) this.view.destroy();
		this.view = null;
	};

	window.Entity = Entity;
})();