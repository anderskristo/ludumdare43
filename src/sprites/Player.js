export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.alive = true;
        this.input = this.scene.input.keyboard.createCursorKeys();

        console.log(this.input)

        this.scene.input.keyboard.on('keydown_Q', function () {
            console.log('pressed Q');

            this.body.setVelocityY(500);
        }, this);

        this.scene.add.existing(this);
    }

    update(time, delta) {
        if (this.alive) {

            if (this.input.left.isDown) {
                if (this.input.up.isDown) {
                    this.direction = 7;
                }
                else if (this.input.down.isDown) {
                    this.direction = 5;
                }
                else {
                    this.direction = 6;
                }
                this.body.setVelocityX(-64);
            } else if (this.input.right.isDown) {
                if (this.input.up.isDown) {
                    this.direction = 1;
                }
                else if (this.input.down.isDown) {
                    this.direction = 3;
                }
                else {
                    this.direction = 2;
                }
                this.body.setVelocityX(64);
            }

            if (this.input.up.isDown) {
                if (this.input.left.isDown) {
                    this.direction = 7;
                }
                else if (this.input.right.isDown) {
                    this.direction = 1;
                }
                else {
                    this.direction = 0;
                }
                this.body.setVelocityY(-64);
            }
            else if (this.input.down.isDown) {
                if (this.input.left.isDown) {
                    this.direction = 5;
                }
                else if (this.input.right.isDown) {
                    this.direction = 3;
                }
                else {
                    this.direction = 4;
                }
                this.body.setVelocityY(64);
            }
        }
    }
}