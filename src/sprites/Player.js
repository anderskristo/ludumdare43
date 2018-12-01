export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.input = this.scene.input.keyboard.createCursorKeys();


        this.scene.input.keyboard.on('keydown_Q', function () {
            console.log('pressed Q');
        }, this);
    }
}