import 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        game.dogBarkingBuffer = null;

        // Fix up prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        game.context = new AudioContext();
        game.analyser = game.context.createAnalyser();
    }

    create() {
        console.log('Game Scene');
        var logo = this.add.image(400, 150, 'logo');

        //this.loadDogSound('./assets/music/song.mp3');

        this.music = this.sound.add('confused');
        this.music.play();
    }

    update() {
        console.log(this.music);
        game.analyser.fftSize = 256;
        var bufferLength = game.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        game.analyser.getByteTimeDomainData(dataArray);

        // Get a canvas defined with ID "oscilloscope"
        var canvas = document.getElementById("auCanvas");
        var canvasCtx = canvas.getContext("2d");

        // draw an oscilloscope of the current audio source


        //requestAnimationFrame(draw);

        game.analyser.getByteTimeDomainData(dataArray);

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
        canvasCtx.lineTo(25, 75);
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    draw() {

        requestAnimationFrame(draw);

        game.analyser.getByteTimeDomainData(dataArray);

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
        canvasCtx.lineTo(20, 20);
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    loadDogSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        var self = this;
        // Decode asynchronously
        request.onload = function () {
            console.log(game.context);
            game.context.decodeAudioData(request.response, function (buffer) {
                console.log('OK', buffer);
                game.dogBarkingBuffer = buffer;
                self.playSound(buffer);
            }, function (error) {
                console.error('ERR', error);
            });
        }
        request.send();
    }

    playSound(buffer) {
        var source = game.context.createBufferSource(); // creates a sound source
        source.buffer = buffer; // tell the source which sound to play
        source.connect(game.context.destination); // connect the source to the context's destination (the speakers)
        source.start(0); // play the source now
        // note: on older systems, may have to use deprecated noteOn(time);
    }
}
