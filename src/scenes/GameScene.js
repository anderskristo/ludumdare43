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
        this.text;
        this.score = 0;
        this.moveSpeed = 20;
    }

    create() {
        console.log('Game Scene');

        // coin image used as tileset
        // var coinTiles = this.map.addTilesetImage('coin');
        // // add coins as tiles
        // this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

        this.createTiledMap();
        this.initPhysics();
        this.createPlayer();
    }

    createTiledMap() {
        // load the map 
        this.map = this.make.tilemap({ key: 'map' });

        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.cameras.main.setBackgroundColor(0xffc0cb);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * Tell the physics system to collide player, appropriate tiles, 
     * and other objects based on group, run callbacks when appropriate
     */
    initPhysics() {
        //this.physics.add.collider(this.player, this.groundLayer);
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 72,
            y: 0
        });
        console.log(this.player);
    }

    createEnemy() {
        console.log('Spawning enemy at',this.groundLayer.x+800, 40);
        this.enemies.push(
            new Enemy({
                scene: this,
                x: this.groundLayer.x+800,
                y: 40
            })
        );
    }

    // this function will be called when the player touches a coin
    collectCoin(sprite, tile) {

    }

    update(time, delta) {
        if (this.cursors.right.isDown) {
            var moveSpeed = this.moveSpeed;
            var enemies = this.enemies;
            this.groundLayer.x = this.groundLayer.x - moveSpeed;
            //var firstElems = this.groundLayer.culledTiles[0].layer.data[0].slice(0, 10);
            //this.groundLayer.culledTiles[0].layer.data[0].push(firstElems);

            // Endless scrolling fugly hack
            if (this.groundLayer.x < -this.map.widthInPixels / 2) {
                this.groundLayer.x = 0;
                this.createEnemy();
            }

            enemies.forEach(function(enemy, index) {
                enemy.x -= moveSpeed;
                if (enemy.x < -50) {
                    enemy.destroy();
                    enemies.splice(index, 1);
                }
            })
        }
        else if (this.cursors.left.isDown) {
            this.groundLayer.x = this.groundLayer.x + moveSpeed;
        }
    }
}
