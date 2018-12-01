export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'enemy');

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.8)
        this.body.setGravityY(0);

        this.scene.add.existing(this);
    }
}