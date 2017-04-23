"use strict";
(function(){
	window.game.presenter = {
		load: function(loader) {
			return loader
				.add("gfx/bg.png")
				.add("gfx/planet.png")
				.add("gfx/station.png")
				.add("gfx/missile.png")
				.add("gfx/explosion.png")
				.add("gfx/enemy.png")
				;
		},

		init: function(app) {
			app.stage.position.set(app.screen.width / 2, app.screen.height / 2);

			this.bg = new PIXI.Sprite(PIXI.loader.resources["gfx/bg.png"].texture);
			this.bg.anchor.set(.5);
			app.stage.addChild(this.bg);

			this.planet = new PIXI.extras.AnimatedSprite(util.animationFrames(
					PIXI.loader.resources["gfx/planet.png"].texture,
					0, 0, 125, 125, 4));
			this.planet.anchor.set(0.5);
			app.stage.addChild(this.planet);

			this.stations = [];
			for (var i = 0; i < game.model.NUM_STATIONS; i++) {
				var station = new PIXI.extras.AnimatedSprite(util.animationFrames(
					PIXI.loader.resources["gfx/station.png"].texture,
					0, 0, 20, 20, 4, 2));
				station.anchor.set(0.5);
				station.visible = false;
				station.rotation = 2 * Math.PI * i / game.model.NUM_STATIONS + Math.PI / 2;
				station.gotoAndStop((i * 7919) % 4);
				app.stage.addChild(station);
				this.stations.push(station);
			}

			this.missiles = new PooledArray(function() {
				var sprite = new PIXI.Sprite(PIXI.loader.resources["gfx/missile.png"].texture);
				sprite.anchor.set(0.5);
				return sprite;
			});

			this.explosions = new PooledArray(function() {
				var sprite = new PIXI.extras.AnimatedSprite(util.animationFrames(
					PIXI.loader.resources["gfx/explosion.png"].texture,
					0, 0, 60, 60, 10));
				sprite.anchor.set(0.5);
				return sprite;
			});

			this.enemies = new PooledArray(function() {
				var sprite = new PIXI.Sprite(PIXI.loader.resources["gfx/enemy.png"].texture);
				sprite.anchor.set(0.5);
				return sprite;
			});

			app.stage.interactive = true;
			app.stage.on("pointerdown", this.onClick.bind(this));

			this.update(app);
		},

		update: function(app) {
			this.planet.position.copy(game.model.planet.pos);
			this.planet.gotoAndStop(3 - game.model.planet.lives);

			for (var i = game.model.stations.length - 1; i >= 0; i--) {
				var station = game.model.stations[i];
				var stationView = this.stations[i];
				stationView.position.copy(station.pos);
				stationView.visible = station.active;
				if ((game.model.planet.lives == 0 || station.cooldown > 0) && stationView.currentFrame < 4) {
					stationView.gotoAndStop(stationView.currentFrame + 4);
				} else if (game.model.planet.lives > 0 && station.cooldown == 0 && stationView.currentFrame >= 4) {
					stationView.gotoAndStop(stationView.currentFrame - 4);
				}
			}

			for (var i = game.model.missiles.objects.length - 1; i >= 0; i--) {
				var missile = game.model.missiles.objects[i];
				if (!missile.view) {
					missile.view = new Destroyable(this.missiles.add(), _.bind(function(obj) {
						this.missiles.remove(obj);
						app.stage.removeChild(obj);
					}, this));
					app.stage.addChild(missile.view.obj);
				}
				var sprite = missile.view.obj;
				sprite.position.copy(missile.pos);
				var delta = missile.getTargetDelta();
				sprite.rotation = Math.atan2(delta.y, delta.x);
			}

			for (var i = game.model.explosions.objects.length - 1; i >= 0; i--) {
				var explosion = game.model.explosions.objects[i];
				if (!explosion.view) {
					explosion.view = new Destroyable(this.explosions.add(), _.bind(function(obj) {
						this.explosions.remove(obj);
						app.stage.removeChild(obj);
					}, this));
					app.stage.addChild(explosion.view.obj);
					explosion.view.obj.rotation = Math.PI / 8 * (2 * Math.random() - 1);
				}
				var sprite = explosion.view.obj;
				sprite.position.copy(explosion.pos);
				sprite.gotoAndStop(Math.floor(Math.min(1, explosion.timer / explosion.duration) * sprite.totalFrames));
				sprite.scale.set(explosion.targetRadius * 4 / (sprite.texture.width + sprite.texture.height));
			}

			for (var i = game.model.enemies.objects.length - 1; i >= 0; i--) {
				var enemy = game.model.enemies.objects[i];
				if (!enemy.view) {
					enemy.view = new Destroyable(this.enemies.add(), _.bind(function(obj) {
						this.enemies.remove(obj);
						app.stage.removeChild(obj);
					}, this));
					app.stage.addChild(enemy.view.obj);
				}
				var sprite = enemy.view.obj;
				sprite.position.copy(enemy.pos);
				sprite.rotation = Math.atan2(-enemy.pos.y, -enemy.pos.x);
			}
		},

		onClick: function(event) {
			if (game.model.planet.lives > 0) {
				var position = event.data.getLocalPosition(this.planet);
				game.model.shoot(position);
			}
		},
	};
})();