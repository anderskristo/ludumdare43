export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.alive = true;
        this.input = this.scene.input.keyboard.createCursorKeys();

        this.jumpSound = this.scene.sound.add('jumpSound');

        // Player should jump
        this.scene.input.keyboard.on('keydown_SPACE', function () {
            this.body.setVelocityY(500);
            this.jumpSound.play();
        }, this);

        this.scene.add.existing(this);
    }
    update(time, delta) {
        if (this.alive) {

        }
    }
}