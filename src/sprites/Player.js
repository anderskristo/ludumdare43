export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        //this.setColliderWorldBounds(true)
        this.input = this.scene.input.keyboard.createCursorKeys();

        this.scene.input.keyboard.on('keydown_Q', function () {
            console.log('pressed Q');

            this.body.setVelocityY(500);
        }, this);

        this.scene.add.existing(this);
    }

    update(time, delta) {
        console.log('#fff');
        if (this.input.up.isDown) {
            console.log('jump');
            this.body.setVelocityY(-64);
        } else if (this.input.down.isDown) {
            console.log('ducka för fan');
            this.body.setVelocityY(64);
        }
    }
}