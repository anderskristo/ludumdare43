export default class Health extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'health', Config.color);

        this.scene = Config.scene;
        this.color = Config.color;

        this.scene.add.existing(this);
    }
}