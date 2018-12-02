import 'phaser';

import Config from '../config/config';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';
import Health from '../sprites/health';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        this.map;
        this.background = {};
        this.player;
        this.enemies = [];
        this.cursors;
        this.groundLayer;
        this.coinLayer;
        this.enemiesLayer;
        this.text;
        this.score = 0;
        this.moveSpeed = 0.7;
        this.speedIncrement = 0.05;
        this.colors = ['0x83ffc1', '0x2cc3ff', '0xffff00', '0xff0000'];
        this.maxHp = 100;
        this.hp = 100;

        this.startColor = this.colors[0];
        this.enemySpawnMinTime = 1000;
        this.enemySpawnMaxTime = 2000;
        this.enemyIsSpawning = false;

        var self;
    }

    create() {
        // Reset this speed when "restarting" game
        this.moveSpeed = 0.7;

        this.enemiesLayer = this.physics.add.group(null);
        this.enemiesLayer.runChildUpdate = true;

        this.createTiledMap();
        this.createScrollBg();
        this.createPlayer();
        this.createHealth();
        this.initPhysics();
        this.loadMusic();
        this.createHud();
        this.setSpriteColor(this.color);

        self = this;

        this.player.anims.play('left', true);
    }

    createScrollBg() {
        this.background.back = this.add.tileSprite(0, 0, Config.width, Config.height, 'bg-back').setOrigin(0, 0);
        this.background.middle = this.add.tileSprite(0, 0, Config.width, Config.height, 'bg-middle').setOrigin(0, 0);
        this.background.fore = this.add.tileSprite(0, 0, Config.width, Config.height, 'bg-fore').setOrigin(0, 0);
    }

    setSpriteColor(color) {
        this.background.middle.setTint(color);
        this.background.fore.setTint(color);
    }

    createTiledMap() {
        // load the map 
        this.map = this.make.tilemap({
            key: 'map'
        });

        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 35);
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.cameras.main.setBackgroundColor(0x000000);
    }

    /**
     * Tell the physics system to collide player, appropriate tiles, 
     * and other objects based on group, run callbacks when appropriate
     */
    initPhysics() {
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.enemiesLayer, this.groundLayer);
        this.physics.add.collider(this.player, this.enemiesLayer, this.onCollision);
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 200,
            y: 430,
            color: this.colors[0]
        });
    }

    createHealth() {
        this.health = new Health({
            scene: this,
            x: 0,
            y: 0,
            color: this.colors[0],
            hp: this.hp
        });
    }

    createEnemy() {
        var spawnX = Config.width + 35; // canvas width + half of sprite width
        var spawnY = 450 + 10; // adjusted Y position. Magic number indeed. Calibrated though

        var color = Math.round(Math.random() * (this.colors.length - 1));

        if (Math.random() < 0.5) {
            //spawnY -= this.player.height;
        }

        var enemy = new Enemy({
            scene: this,
            x: spawnX,
            y: spawnY,
            color: this.colors[color]
        });

        this.enemies.push(enemy);
        this.enemiesLayer.add(enemy);
    }

    loadMusic() {
        this.music = this.sound.add('trance');
        this.music.setLoop(true);
        this.music.play();
        this.music.setVolume(.1);
    }

    addScore(value) {
        this.score += value;
        this.scoreText.setText(Math.round(this.score))
    }

    createHud() {
        this.scoreText = this.add.text(300, 150, this.score, {
            fontFamily: 'sans-serif',
            color: '#ffffff40',
            align: 'center',
            fontSize: 158,
            fontStyle: 'bold',
            padding: 0,
            width: 300
        });
        this.scoreText.setPosition(game.canvas.width / 2 - this.scoreText.width, 150);
    }

    onCollision(player, enemy) {
        if (player.color === enemy.color) {
            var colorIndex = Math.round(Math.random() * (self.colors.length - 1));
            enemy.destroy();
            self.moveSpeed += self.speedIncrement;
            player.setColor(self.colors[colorIndex]);
        } else {
            if (player.alive) {
                player.alive = false
                player.dead();
            }
            self.gameOver();
        }
    }

    gameOver() {
        this.gameOverText = this.add.text(16, 200, 'You are dead.', {
            fontSize: '32px',
            fill: '#fff'
        });

        this.music.stop();
        this.score = 0;
        this.player.anims.stop('left', true);

        var playButton = this.add.image(400, 120, "playButton").setInteractive();
        playButton.on("pointerdown", function (e) {
            self.scene.restart('GameScene');
            self.hp = self.maxHp;
        });
    }

    update(time, delta) {
        if (this.player.alive && this.health.hp > 0) {
            // Move background tiles
            this.background.back._tilePosition.x += this.moveSpeed / 6 * delta;
            this.background.middle._tilePosition.x += this.moveSpeed / 3 * delta;
            this.background.fore._tilePosition.x += this.moveSpeed * delta;

            // The player class update method must be called each cycle as the class is not currently part of a group
            this.player.update(time, delta);
            this.addScore(0.05);

            var moveSpeed = this.moveSpeed;
            var enemies = this.enemies;

            if (this.player.alive && !this.enemyIsSpawning) {
                var spawnState = this;
                this.enemyIsSpawning = true;
                var spawnDelay = Math.random() * (this.enemySpawnMaxTime - this.enemySpawnMinTime) + this.enemySpawnMinTime;
                setTimeout(function () {
                    spawnState.enemyIsSpawning = false;
                    spawnState.createEnemy();
                }, spawnDelay);
            }

            enemies.forEach(function (enemy, index) {
                enemy.x -= moveSpeed * delta;
                if (enemy.x < -50) {
                    self.health.updateHealth(enemy.color);
                    enemy.destroy();
                    enemies.splice(index, 1);
                }
            });

            this.setSpriteColor(this.player.color);
        } else {
            this.gameOver();
        }
    }
}