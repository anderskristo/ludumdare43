import 'phaser';

import Config from '../config/config.js';
import GameScene from './GameScene';
import MenuPlayer from '../sprites/MenuPlayer';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });

        this.map;
        this.player;
        this.initPlayerUpdateDelay = 300;
        this.playerUpdateDelay = 0;
        this.groundLayer;
        this.instructions;

    }

    create() {
        this.createTiledMap();
        this.createPlayer();
        this.initPhysics();

        this.player.anims.play('left', true);

        this.instructions = this.add.text(40, 200, 'Collect blocks of the same color\nor your gas will run out!\nAvoid blocks in other colors.', { fontSize: '32px', fill: '#39ff14' });
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scene.add('GameScene', GameScene);
        var self = this;

        var playButton = this.add.image(Config.width/2, 120, "playButton").setInteractive();

        playButton.on("pointerdown", function (e) {
            self.scene.start('GameScene');
        });
    }

    createTiledMap() {
        this.map = this.make.tilemap({ key: 'map' });
        var groundTiles = this.map.addTilesetImage('tiles');
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;
        this.cameras.main.setBackgroundColor(0x000000);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    initPhysics() {
        this.physics.add.collider(this.player, this.groundLayer);
    }

    createPlayer() {
        this.player = new MenuPlayer({
            scene: this,
            x: 200,
            y: 100
        });
        this.player.setTint(0x39ff14);
    }

    update(time, delta) {
        if (this.key.isDown) {
            this.scene.start('GameScene');
        }
        if (this.playerUpdateDelay > this.initPlayerUpdateDelay) {
            this.player.update(time, delta);
            this.playerUpdateDelay = 0;
        }
        this.playerUpdateDelay++;
    }
}