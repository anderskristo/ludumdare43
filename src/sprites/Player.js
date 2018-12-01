export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.alive = true;
        this.input = this.scene.input.keyboard.createCursorKeys();

        this.scene.input.keyboard.on('keydown_SPACE', function () {
            this.body.setVelocityY(500);
        }, this);

        this.scene.add.existing(this);
    }

    update(time, delta) {
        console.log(this.alive)
        if (this.alive) {

            if (this.input.up.isDown) {
                this.body.setVelocityY(-64);
            }
            else if (this.input.down.isDown) {
                this.body.setVelocityY(64);
            }
        }
    }
}