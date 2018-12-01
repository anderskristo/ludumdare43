export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.body.setSize(this.width, this.height - 8);
        this.alive = true;
        this.input = this.scene.input.keyboard.createCursorKeys();

        this.jumpSound = this.scene.sound.add('jumpSound');

        // Player should jump
        // this.scene.input.keyboard.on('keydown_SPACE', function () {
        //     this.jump();
        // }, this);

        this.scene.add.existing(this);
    }

    jump() {
        this.body.setVelocityY(-450);
        this.jumpSound.play();
    }

    update(time, delta) {
        if (this.alive) {
            if (this.input.up.isDown && this.body.onFloor()) {
                this.jump();
            }
        } else {
            // How can we die?
            // Load game over scene
        }
    }
}