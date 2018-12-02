export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'enemy', Config.color);

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.color = Config.color;

        this.setTint(this.color);

        this.body.setBounce(0.8)
        this.body.setGravityY(0);

        this.scene.add.existing(this);
    }

    update(time, delta) {
        //console.log(this.scene)
    }
}