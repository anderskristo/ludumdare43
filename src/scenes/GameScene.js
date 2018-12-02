import 'phaser';

import Player from '../sprites/player';
import Enemy from '../sprites/enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        this.map;
        this.player;
        this.enemies = [];
        this.cursors;
        this.groundLayer;
        this.coinLayer;
        this.enemiesLayer;
        this.text;
        this.score = 0;
        this.moveSpeed = 10;
        this.speedIncrement = 1;
        this.colors = ['0x00ff00', '0x0000ff', '0xffff00', '0xff0000'];
        this.startColor = this.colors[0];
        this.enemySpawnMinTime = 1000;
        this.enemySpawnMaxTime = 2000;
        this.enemyIsSpawning = false;

        var self;
    }

    create() {
        this.enemiesLayer = this.physics.add.group(null);
        this.enemiesLayer.runChildUpdate = true;

        this.createTiledMap();
        this.createPlayer();
        this.initPhysics();
        this.loadMusic();
        this.scoreHud();
        self = this;

        this.player.anims.play('left', true);
    }

    createTiledMap() {
        // load the map 
        this.map = this.make.tilemap({
            key: 'map'
        });

        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
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
        console.log(this.player, this.groundLayer)
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.enemiesLayer, this.groundLayer);
        this.physics.add.collider(this.player, this.enemiesLayer, this.onCollision);
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 72,
            y: 430,
            color: this.colors[0]
        });
    }

    createEnemy() {
        var spawnX = 800;
        var spawnY = 460;
        var color = Math.round(Math.random() * (this.colors.length - 1));
        console.log('colorindex', color)

        if (Math.random() < 0.5) {
            spawnY -= this.player.height;
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

    // this function will be called when the player touches a coin
    collectCoin(sprite, tile) {

    }

    addScore(value) {
        this.score += value;
        this.scoreText.setText(this.score)
    }

    scoreHud() {
        this.scoreText = this.add.text(16, 200, this.score, {
            fontFamily: 'sans-serif',
            color: '#00000040',
            align: 'center',
            fontSize: 102,
            fontStyle: 'bold',
            padding: 0,
        });

        this.scoreText.setPosition(game.canvas.width / 2 - this.scoreText.width, 100);
    }

    onCollision(player, enemy) {
        console.log('collision', player.color, enemy.color);
        if (player.color === enemy.color) {
            var colorIndex = Math.round(Math.random() * (self.colors.length - 1));
            enemy.destroy();
            self.moveSpeed += self.speedIncrement;
            player.setColor(self.colors[colorIndex]);
            console.log(player.color);
        } else {
            player.alive = false
            enemy.x += 20
        }
    }

    gameOver() {
        this.moveSpeed = 0;
        this.gameOverText = this.add.text(16, 200, 'You are dead.\nScore: ' + this.score, {
            fontSize: '32px',
            fill: '#000'
        });

        this.score = 0;
        this.player.color = 'green';

        var self = this;
        var playButton = this.add.image(400, 120, "playButton").setInteractive();

        playButton.on("pointerdown", function (e) {
            //self.scene.restart('GameScene');
            self.scene.start('GameScene');
        });
    }

    update(time, delta) {
        // The player class update method must be called each cycle as the class is not currently part of a group
        this.player.update(time, delta);
        this.addScore(1);

        var moveSpeed = this.moveSpeed;
        var enemies = this.enemies;
        this.groundLayer.x -= moveSpeed;

        // Endless scrolling fugly hack
        if (this.groundLayer.x < -this.map.widthInPixels / 2) {
            this.groundLayer.x = 0;
        }

        if (this.player.alive && !this.enemyIsSpawning) {
            var self = this;
            this.enemyIsSpawning = true;
            var spawnDelay = Math.random() * (this.enemySpawnMaxTime - this.enemySpawnMinTime) + this.enemySpawnMinTime;
            setTimeout(function () {
                self.enemyIsSpawning = false;
                self.createEnemy();
            }, spawnDelay);
        }

        enemies.forEach(function (enemy, index) {
            enemy.x -= moveSpeed;
            if (enemy.x < -50) {
                enemy.destroy();
                enemies.splice(index, 1);
            }
        })

        /**
         * If Player dies, kill the game.
         */
        //this.player.alive = false;
        if (this.player.alive === false) {
            this.gameOver();
        }
    }
}