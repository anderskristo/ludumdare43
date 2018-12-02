import 'phaser';

import Config from '../config/config';
import MenuScene from './MenuScene';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'IntroScene'
        });
    }

    loadMusic() {
        this.music = this.sound.add('confused');
        this.music.setLoop(true);
        this.music.play();
        this.music.setVolume(.1);
    }

    stopMusic() {
        this.music.stop();
    }

    create() {
        console.log('Intro Scene');

        this.scene.add('MenuScene', MenuScene);
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var self = this;

        var introScene = this.add.image(Config.width / 2, Config.height / 2, "introImage").setInteractive();
        introScene.setDisplaySize(600, 600);

        introScene.on("pointerdown", function (e) {
            self.music.stop();
            self.scene.start('MenuScene');
        });

        this.loadMusic();

    }

    update(time, delta) {
        if (this.key.isDown) {
            this.scene.start('MenuScene');
        }
    }
}