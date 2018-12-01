export default {
    type: Phaser.AUTO,
    parent: 'gameParent',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    }
}