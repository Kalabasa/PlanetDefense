"use strict";
(function(){
	window.game.model = {
		NUM_STATIONS: 6,

		planet: {
			pos: new PIXI.Point(),
			radius: 68,
			lives: 3,
		},
		stations: [],
		missiles: new EntityPooledArray(Missile),
		explosions: new EntityPooledArray(Explosion),
		enemies: new EntityPooledArray(Enemy),

		time: 0,
		lastSpawnTime: 0,

		init: function() {
			for (var i = 0; i < this.NUM_STATIONS; i++) {
				this.stations[i] = {
					active: false,
					cooldown: 0,
					pos: new PIXI.Point(),
					planetAngle: 0,
				};
				this.buildStation(i);
			}
		},

		update: function() {
			this.time++;

			for (var i = this.stations.length - 1; i >= 0; i--) {
				var station = this.stations[i];
				if (station.cooldown) {
					station.cooldown--;
				}

				for (var j = this.explosions.objects.length - 1; j >= 0; j--) {
					var explosion = this.explosions.objects[j];
					var rr = explosion.radius;
					rr *= rr;
					if (util.distance2(station.pos, explosion.pos) <= rr) {
						station.cooldown = Math.max(station.cooldown, 6 * game.SEC);
					}
				}
			}

			for (var i = this.missiles.objects.length - 1; i >= 0; i--) {
				var missile = this.missiles.objects[i];
				missile.update();

				if (util.length2(missile.getTargetDelta()) < 16) {
					this.explode(missile.pos);
					this.missiles.remove(missile);
					continue;
				}
			}

			for (var i = this.explosions.objects.length - 1; i >= 0; i--) {
				var explosion = this.explosions.objects[i];
				explosion.update();

				if (explosion.timer >= explosion.duration) {
					this.explosions.remove(explosion);
				}
			}

			var prr = this.planet.radius;
			prr *= prr;
			enemiesUpdateLoop: for (var i = this.enemies.objects.length - 1; i >= 0; i--) {
				var enemy = this.enemies.objects[i];
				enemy.update();

				if (util.length2(enemy.pos) <= prr) {
					this.explode(enemy.pos, 60);
					if (this.planet.lives) {
						this.planet.lives--;
					}
					this.enemies.remove(enemy);
					continue enemiesUpdateLoop;
				}

				for (var j = this.explosions.objects.length - 1; j >= 0; j--) {
					var explosion = this.explosions.objects[j];
					var rr = explosion.radius + 4;
					rr *= rr;
					if (util.distance2(enemy.pos, explosion.pos) <= rr) {
						this.enemies.remove(enemy);
						continue enemiesUpdateLoop;
					}
				}
			}

			if (this.planet.lives > 0) {
				this.makeEnemies();
			}
		},

		shoot: function(point) {
			var station = this.findNearestAvailableStation(point);
			if (!station) return;
			var missile = this.missiles.add();
			missile.pos.copy(station.pos);
			missile.target.copy(point);
			station.cooldown = 3 * game.SEC;
		},

		explode: function(point, radius) {
			var explosion = this.explosions.add();
			explosion.pos.copy(point);
			if (radius) explosion.targetRadius = radius;
		},

		makeEnemies: function() {
			const max = 2 + Math.ceil(Math.log(this.time * 3 * game.PER_SEC, 2));
			const interval = 3 * (1 - Math.cos(this.time / (8 * game.SEC) * 2 * Math.PI)) * game.SEC;

			const baseAngle = this.time * 0.1 * Math.PI * game.PER_SEC;
			const angleRange = Math.min(1, 0.1 + this.time * 0.004 * game.PER_SEC);

			const baseSpeed = 30 * game.PER_SEC;
			const speedRange = (this.time * 0.3 * game.PER_SEC) * game.PER_SEC;
			const speedGrades = 10 * game.PER_SEC;
			const maxSpeed = 90;

			if (this.enemies.objects.length < max
				&& this.time - this.lastSpawnTime >= interval) {
				this.lastSpawnTime = this.time;
				var enemy = this.enemies.add();
				var angle = baseAngle + angleRange * 2 * Math.PI * Math.random();
				var distance = 389 + Math.random() * 40;
				enemy.pos.x = Math.cos(angle) * distance;
				enemy.pos.y = Math.sin(angle) * distance;
				enemy.speed = Math.min(maxSpeed, baseSpeed + Math.floor(speedRange * Math.random() / speedGrades) * speedGrades);
			}
		},

		buildStation: function(index) {
			var station = this.stations[index];
			station.active = true;

			var angle = 2 * Math.PI * index / this.NUM_STATIONS;
			var x = Math.cos(angle) * this.planet.radius;
			var y = Math.sin(angle) * this.planet.radius;
			station.pos.set(x, y);

			station.planetAngle = angle;
		},

		findNearestAvailableStation: function(target) {
			var nearestStation = null;
			var nearestDistance = Infinity;
			for (var i = 0; i < this.NUM_STATIONS; i++) {
				var station = this.stations[i];
				if (!this.isStationAvailable(station, target)) continue;
				var distance = util.distance2(station.pos, target);
				if (distance < nearestDistance) {
					nearestDistance = distance;
					nearestStation = station;
				}
			}
			return nearestStation;
		},

		isStationAvailable: function(station, target) {
			if (!station.active || station.cooldown > 0) return false;
			var deltaAngle = util.deltaAngle(util.angle(station.pos, target), station.planetAngle);
			if (Math.abs(deltaAngle) > Math.PI * 0.6)
				return false;
			return true;
		},
	};
})();