import 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    create() {
        console.log('Game Scene');
        var logo = this.add.image(400, 150, 'logo');
    }

    update() { }
}
