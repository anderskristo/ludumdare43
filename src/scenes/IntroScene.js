import 'phaser';

import MenuScene from './MenuScene';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'IntroScene'
        });        
    }

    create() {
        console.log('Intro Scene');

        this.scene.add('MenuScene', MenuScene);
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var self = this;

        var introScene = this.add.image(400, 300, "introImage").setInteractive();
        introScene.setDisplaySize(800,600);

        introScene.on("pointerdown", function (e) {
            self.scene.start('MenuScene');
        });
    }

    update(time,delta) {
        if (this.key.isDown) {
            this.scene.start('MenuScene');
        }
    }
}