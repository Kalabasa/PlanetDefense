"use strict";
(function(){
	function Destroyable(obj, destroyer) {
		this.obj = obj;
		this.destroyer = destroyer;
	};
	Destroyable.prototype.destroy = function() {
		this.destroyer(this.obj);
		this.obj = null;
	};
	window.Destroyable = Destroyable;
})();