import 'phaser';
import Config from './config/config';
import PreloadScene from './scenes/PreloadScene';

class Game extends Phaser.Game {
    constructor() {
        super(Config);

        this.scene.add('PreloadScene', PreloadScene);
        this.scene.start('PreloadScene');
    }
}

window.onload = function () {
    FBInstant.initializeAsync().then(function () {
        window.game = new Game();
    }).catch(function (error) {
        console.log(error.message);
    });
}