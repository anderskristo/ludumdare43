export default class Health extends Phaser.GameObjects.Shape {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'health', Config.color, Config.hp);

        this.scene = Config.scene;
        this.color = Config.color;
        this.hp = Config.hp;

        this.healthText = this.scene.add.text(20, 20, 'NEON GAS: ' + this.hp + '%', {
            fontFamily: 'sans-serif',
            color: '#ffffff40',
            align: 'left',
            fontSize: 42,
            fontStyle: 'bold',
            padding: 0,
        });

        this.scene.add.existing(this);
    }

    updateHealth(enemyColor) {
        this.color = this.scene.player.color;

        if (this.color === enemyColor) {
            this.hp -= 25;
            this.healthText.setText('NEON GAS: ' + this.hp + '%');

            this.scene.hp = this.hp;
        }
    }
}