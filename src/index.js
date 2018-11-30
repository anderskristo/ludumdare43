import 'phaser';

import Preload from './scenes/Preload';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        Preload
    }
};

const game = new Phaser.Game(config);