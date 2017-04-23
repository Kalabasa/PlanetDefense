"use strict";
(function(){
	function PooledArray(factory, initializer, destroyer) {
		this.initializer = initializer;
		this.destroyer = destroyer;
		this.pool = deePool.create(factory);
		this.objects = [];
	};
	
	PooledArray.prototype.add = function() {
		var obj = this.pool.use();
		if (this.initializer) this.initializer.call(obj, obj);
		this.objects.push(obj);
		return obj;
	};

	PooledArray.prototype.remove = function(obj) {
		if (this.destroyer) this.destroyer.call(obj, obj);
		this.pool.recycle(obj);
		this.objects.splice(_.indexOf(this.objects, obj), 1);
	};

	function EntityPooledArray(type) {
		PooledArray.call(this, function() {
			return new type();
		}, function(obj) {
			obj.init();
		}, function(obj) {
			obj.destroy();
		});
	};
	EntityPooledArray.prototype = Object.create(PooledArray.prototype);

	window.PooledArray = PooledArray;
	window.EntityPooledArray = EntityPooledArray;
})();