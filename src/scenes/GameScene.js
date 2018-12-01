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

        this.loadDogSound('./assets/music/song.mp3');
    }

    update() {
        game.analyser.fftSize = 2048;
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

        // Decode asynchronously
        request.onload = function () {
            console.log(game.context)
            game.context.decodeAudioData(request.response, function (buffer) {
                console.log('OK', buffer);
                game.dogBarkingBuffer = buffer;
                this.playSound(buffer);
            }, function (error) {
                console.error('ERR', error);
            });
        }
        request.send();
    }

    playSound(buffer) {
        var source = game.context.createBufferSource(); // creates a sound source
        source.buffer = buffer; // tell the source which sound to play
        source.connect(context.destination); // connect the source to the context's destination (the speakers)
        source.start(0); // play the source now
        // note: on older systems, may have to use deprecated noteOn(time);
    }
}
/*
//const game = new Phaser.Game(config);
console.log('audioCtx');
//800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }
var game = new Phaser.Game(config);
console.log(game)
var mods = [];
var current = 0;

var vumeter = [];
var channels = [];

var module;

function preload() {

    this.load.script('protracker', 'assets/ProTracker.js');

    this.load.image('vu', 'assets/logo.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('bg', 'assets/logo.png');
    this.load.image('vulkaiser', 'assets/logo.png');

    this.load.binary('shampoo', 'assets/act_of_impulse.mod', modLoaded, this);
}

function modLoaded(key, data) {

    mods.push(key);
    var buffer = new Uint8Array(data);
    return buffer;

}

function load_next_module()
{
    current == mods.length - 1 ? current = 0 : current++;

    module.stop();
    module.clearsong();

    //module.buffer = game.cache.getBinary(mods[current]);
    module.buffer = game.cache.binary.get(mods[current]);
    module.parse();

    // BUG if width==0
    // for (var i = 0; i < vumeter.length; i++)
    // {
    //     vumeter[i].width = 1;
    // }

}

function create() {

    this.add.sprite(0, 0, 'bg');
    this.add.sprite(500, 32, 'logo');
    this.add.sprite(580, 371, 'vulkaiser');

    for (var i = 0, y = 200; i < 4; i++, y += 50)
    {
        vumeter[i] = this.add.sprite(400, y, 'vu');
//vumeter[i].crop(new Phaser.Geom.Rectangle(0, 0, 300, 30));
        vumeter[i].frame.cutHeight = 30;
        vumeter[i].frame.cutWidth = 300;
    }

    module = new Protracker();

    //module.play() has to be called from a callback
    module.onReady = function() {
        module.play();
    };
console.log(module)
    //this.cache = new BaseCache();
    //this.cache.add('bacon', mods[current]);
    //module.buffer = this.cache.get(bacon);
    module.buffer = game.cache.binary.get(mods[current]);
    module.parse();

    //this.input.onDown.add(load_next_module, this);
    this.input.on('down',load_next_module);

}

function update() {

    //  module.sample = array of Objects containing informations about a played sample

    for (var i = 0; i < vumeter.length; i++)
    {
        if (module.channel[i])
        {
            var smp_index = module.channel[i].sample;
            channels[i] = { sample_index:smp_index, sample_name: module.sample[smp_index].name };

            var w = Math.round(module.vu[i] * 1200);

            if (w > 300)
            {
                w = 300;
            }

            vumeter[i].cropRect.width = w;
            vumeter[i].updateCrop();
        }
    }

}

function render() {

    for (var i = 0, y = 32; i < vumeter.length; i++, y += 32)
    {
        if (channels[i])
        {
            this.debug.text('Channel #' + i + ' : sample ' + channels[i].sample_index + '  ' + channels[i].sample_name, 16, y);
            // game.debug.text('vu' + i + ': ' + module.vu[i], 16, 350 + y);
        }
    }

    this.debug.text('Position: ' + module.position, 16, 160);
    this.debug.text('Pattern: ' + module.row, 16, 192);
    this.debug.text('BPM: ' + module.bpm, 16, 224);
    this.debug.text('Speed: ' + module.speed, 16, 256);
    this.debug.text('Name: ' + module.title, 16, 288);
    this.debug.text('Signature: ' + module.signature, 16, 320);

}
*/