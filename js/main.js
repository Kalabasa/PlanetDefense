"use strict";
(function(){
	const UPS = 120;
	game.SEC = UPS; // multiply to duration values (e.g., 4s = 4 * game.SEC)
	game.PER_SEC = 1 / UPS; // multiply to rate values (e.g., 8px/s = 8 * game.PER_SEC)

	var app = new PIXI.Application(550, 550);
	document.body.append(app.view);

	game.presenter.load(PIXI.loader).load(init);

	function init() {
		game.model.init();
		game.presenter.init(app);

		const MSPU = 1000 / UPS;
		var time = 0;
		app.ticker.add(function() {
			time += app.ticker.elapsedMS;
			while (time >= MSPU) {
				time -= MSPU;
				game.model.update();
			}
			game.presenter.update(app);
		});
	}
})();