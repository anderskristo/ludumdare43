import 'phaser';
import IntroScene from './IntroScene';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloadScene'
        });
    }

    preload() {
        console.log('testar preload');

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        
        this.assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        this.assetText.setOrigin(0.5, 0.5);
        this.loadingText.setOrigin(0.5, 0.5);
        

        // Create background and prepare the loading bar
        this.cameras.main.setBackgroundColor(0x0c0b0b);
        this.fullBar = this.add.graphics();
        this.fullBar.fillStyle(0x333333, 1);
        this.fullBar.fillRect((width / 4) - 2, (height / 2), (width / 2), 20);
        this.progress = this.add.graphics();

        this.percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 10,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#fff'
            }
        });
        this.percentText.setOrigin(0.5, 0.5);

        // Pass loading progress as value
        this.load.on('progress', function (value) {
            this.percentText.setText(parseInt(value * 100) + '%');
            this.progress.clear();
            this.progress.fillStyle(0x00aa80, value);
            this.progress.fillRect((width / 4), (height / 2), (width / 2), 20);
        }, this);

        // Pass loading progress as value
        this.load.on('fileprogress', function (file) {
            this.assetText.setText('Loading asset: ' + file.key);
        }, this);

        // Cleanup after loading is done
        this.load.on('completea', function () {
            this.progress.destroy();
            this.percentText.destroy();
            this.assetText.destroy();
            this.fullBar.destroy();
        }, this);

        this.load.pack('Preload', 'assets/assets.json', 'Preload');
    }

    create() {
        //this.scene.add('IntroScene', IntroScene);
        //this.scene.start('IntroScene');
    }
}