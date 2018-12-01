import 'phaser';
import GameScene from './GameScene';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloadScene'
        });
    }

    preload() {
        console.log('testar preload');

        // Create background and prepare the loading bar
        this.cameras.main.setBackgroundColor(0x0c0b0b);
        this.fullBar = this.add.graphics();
        this.fullBar.fillStyle(0xffffff, 1);
        this.fullBar.fillRect((this.cameras.main.width / 4) - 2, (this.cameras.main.height / 2), (this.cameras.main.width / 2), 20);
        this.progress = this.add.graphics();

        // Pass loading progress as value
        this.load.on('progress', function (value) {
            this.progress.clear();
            this.progress.fillStyle(0xd63116, 1);
            this.progress.fillRect((this.cameras.main.width / 4), (this.cameras.main.height / 2), (this.cameras.main.width / 2), 20);
        }, this);

        // Cleanup after loading is done
        this.load.on('complete', function () {
            this.progress.destroy();
            this.fullBar.destroy();
        }, this);

        this.load.pack('Preload', 'assets/assets.json', 'Preload');
    }

    create() {
        this.scene.add('GameScene', GameScene);
        this.scene.start('GameScene');
    }
}