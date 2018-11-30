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
    window.game = new Game();
}

/* var game = new Phaser.Game(config);
console.log(game) */

/* function preload() {
    this.load.image('vu', 'assets/logo.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('bg', 'assets/logo.png');
    this.load.image('vulkaiser', 'assets/logo.png');
    //this.load.binary('shampoo', 'assets/act_of_impulse.mod', modLoaded, this);
}
var dogBarkingBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var analyser = context.createAnalyser();

function loadDogSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
        console.log('OK',buffer);
        dogBarkingBuffer = buffer;
        playSound(buffer);
    }, function(error) {
        console.error('ERR',error);
    });
    }
    request.send();
}
function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                                // note: on older systems, may have to use deprecated noteOn(time);
}
function create() {

    loadDogSound('assets/music1.mp3');

}

function update() {
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Get a canvas defined with ID "oscilloscope"
    var canvas = document.getElementById("auCanvas");
    var canvasCtx = canvas.getContext("2d");

    // draw an oscilloscope of the current audio source
    function draw() {

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";

        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * canvas.height / 2;

            if (i === 0) {
            canvasCtx.moveTo(x, y);
            } else {
            canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        canvasCtx.lineTo(20,20);
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    draw();

}

function render() {

}
 */