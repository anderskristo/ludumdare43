import 'phaser';

import Player from '../sprites/player';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    create() {
        console.log('Game Scene');
        var logo = this.add.image(400, 150, 'logo');

        this.createPlayer();
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 0,
            y: 0
        });
    }

    update() { }
}
