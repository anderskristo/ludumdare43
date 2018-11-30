export default class Player extends Phaser.GameObjects.Sprite {
    constructor() {
        super({
            key: ''
        });
    }

    create() {
        console.log('Player Object');
    }
}