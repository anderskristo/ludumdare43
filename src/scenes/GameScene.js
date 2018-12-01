import 'phaser';

import Player from '../sprites/player';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        this.map;
        this.player;
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
        this.createPlayer();
        this.initPhysics();
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
        console.log(this.player, this.groundLayer)
        this.physics.add.collider(this.player, this.groundLayer);
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 72,
            y: 430
        });
    }

    // this function will be called when the player touches a coin
    collectCoin(sprite, tile) {

    }

    update(time, delta) {
        // The player class update method must be called each cycle as the class is not currently part of a group
        this.player.update(time, delta);

        if (this.cursors.right.isDown) {
            this.groundLayer.x = this.groundLayer.x - this.moveSpeed;
            //var firstElems = this.groundLayer.culledTiles[0].layer.data[0].slice(0, 10);
            //this.groundLayer.culledTiles[0].layer.data[0].push(firstElems);

            if (this.groundLayer.x < -this.map.widthInPixels / 2) {
                this.groundLayer.x = 0;
            }
        }
        else if (this.cursors.left.isDown) {
            this.groundLayer.x = this.groundLayer.x + this.moveSpeed;
        }
    }
}
