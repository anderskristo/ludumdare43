export default class MenuPlayer extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.alive = true;
        this.scene.add.existing(this);
        this.setRandomVelocity();

        game.anims.create({
            key: 'left',
            frames: game.anims.generateFrameNames('player'),
            frameRate: 10,
            repeat: -1
        });
    }

    update(time, delta) {
        if (this.alive) {
            this.setRandomVelocity();
        }
    }
    setRandomVelocity() {
        var randomVelocity = Math.random() * 120 - 60;
        this.body.setVelocityX(randomVelocity);
        if (randomVelocity < 0) {
            this.flipX = true;
        } else {
            this.flipX = false;
        }
    }
}