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
        this.key;
        this.isGameOver = false;
        this.restartButton;
        this.startColor = this.colors[0];
        this.enemySpawnMinTime = 1000;
        this.enemySpawnMaxTime = 2000;
        this.enemyIsSpawning = false;
        this.emitterConfig;
        this.emitter;

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
        if (!this.music) {
            this.loadMusic();
        } else {
            this.music.play();
        }
        this.createHud();
        this.setSpriteColor(this.color);

        self = this;
        this.player.anims.play('left', true);
        this.playerAnimSpeedScale = 2;
        this.player.anims.setTimeScale(this.playerAnimSpeedScale + this.moveSpeed);

        this.emitterConfig = {
            name: 'sparks',
            x: 400,
            y: 300,
            speed: { min: 150, max: 580 },
            angle: { min: 220, max: 335 },
            scale: { start: 1, end: 0.2 },
            alpha: { start: 0.5, end: 0 },
            gravityX: 0,
            gravityY: -300,
            maxParticles: 100,
            lifeSpan: 2000,
            blendMode: 'SCREEN'
        };
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

    updateHealth(enemyColor) {
        if (self.player.color === enemyColor) {
            this.hp -= 25;
            this.healthText.setText('NEON GAS: ' + this.hp + '%');
        }
    }

    onCollision(player, enemy) {
        if (player.alive) {
            var newEmitterConfig = self.emitterConfig;
            newEmitterConfig.x = player.x;
            newEmitterConfig.y = player.y;
            newEmitterConfig.tint = parseInt(player.color);
            var newEmitter = self.add.particles('spark').createEmitter(newEmitterConfig);
            setTimeout(function () {
                newEmitter.explode();
            }, 200);

            if (player.color === enemy.color) {
                var colorIndex = Math.round(Math.random() * (self.colors.length - 1));
                console.log('Removed pickup', enemy.x);
                enemy.destroy();
                self.moveSpeed += self.speedIncrement;
                player.anims.setTimeScale(self.playerAnimSpeedScale + self.moveSpeed);
                player.setColor(self.colors[colorIndex]);
            } else {
                if (player.alive) {
                    player.alive = false
                    player.dead();
                }
                self.gameOver();
            }
        }
    }

    gameOver() {
        if (!this.isGameOver) {
            this.gameOverText = this.add.text(16, 200, 'You are dead.', {
                fontSize: '32px',
                fill: '#fff'
            });

            this.music.stop();
            this.score = 0;
            this.player.anims.stop('left', true);

            // Death animation
            this.tweens.add({
                targets: this.player,
                x: 300,
                alpha: 0,
                ease: 'Power1',
                duration: 1000,
                delay: 0
            });

            this.restartButton = this.add.image(400, 120, "playButton").setInteractive();

            this.isGameOver = true;

            // Delay space "listening" to avoid holding space will restart
            setTimeout(function () {
                self.key = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                console.log('key', self.key)
            }, 500);
        }

        if (this.key && this.key.isDown) {
            self.scene.restart('GameScene');
            self.hp = self.maxHp;
            this.isGameOver = false;
        }

        this.restartButton.on("pointerdown", function (e) {
            self.scene.restart('GameScene');
            self.hp = self.maxHp;
            self.isGameOver = false;
        });
    }

    update(time, delta) {
        var moveSpeed = this.moveSpeed;

        //console.log(this.hp);
        if (this.player.alive && this.hp > 0) {
            // Move background tiles
            this.background.back._tilePosition.x += moveSpeed / 6 * delta;
            this.background.middle._tilePosition.x += moveSpeed / 3 * delta;
            this.background.fore._tilePosition.x += moveSpeed * delta;

            // The player class update method must be called each cycle as the class is not currently part of a group
            this.player.update(time, delta);
            this.addScore(0.05);

            if (this.player.alive && !this.enemyIsSpawning) {
                var spawnState = this;
                this.enemyIsSpawning = true;
                var spawnDelay = Math.random() * (this.enemySpawnMaxTime - this.enemySpawnMinTime) + this.enemySpawnMinTime;
                setTimeout(function () {
                    spawnState.enemyIsSpawning = false;
                    spawnState.createEnemy();
                }, spawnDelay);
            }

            var enemies = this.enemies;
            enemies.forEach(function (enemy, index) {
                enemy.x -= moveSpeed * delta;

                if (enemy.color === self.player.color && enemy.active === true) {
                    if (enemy.x < -71) {
                        self.health.updateHealth(enemy.color)
                        enemy.destroy();
                        enemies.splice(enemy, 1);
                    }
                } else {
                    if (enemy.x <= -71) {
                        enemy.destroy();
                    }
                }
            });

            this.setSpriteColor(this.player.color);
        } else {
            this.gameOver();
        }
    }
}