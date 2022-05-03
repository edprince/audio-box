import noUiSlider from 'https://cdn.skypack.dev/nouislider';
import wNumb from 'https://cdn.skypack.dev/wnumb';

import { buildChart, addData } from "./chart.js";
import { generateCanvas, renderAxes } from './eq.js';

const eqPips = {
    mode: "steps",
    density: 3,
    format: wNumb({
        suffix: "hZ",
        edit: function (value) {
            return (value == '2000hZ') ? '2khZ' : value;
        }
    })
}

const eqGainPips = {
    mode: "steps",
    density: 3,
    format: wNumb({
        suffix: "dB"
    })

}

const gainSlider = document.getElementById('slider-gain');
const eq1Slider = document.getElementById('slider-eq1');
const eq2Slider = document.getElementById('slider-eq2');

noUiSlider.create(gainSlider, {
    start: [1],
    snap: false,
    connect: 'lower',
    orientation: 'vertical',
    direction: "rtl",
    pips: {
        mode: "steps",
        density: 3
    },
    range: {
        'min': 0,
        'max': 2
    }
});

noUiSlider.create(eq1Slider, {
    start: [1],
    snap: false,
    pips: eqGainPips,
    connect: 'lower',
    orientation: 'vertical',
    direction: 'rtl',
    range: {
        'min': -10,
        'max': 10
    }
});

noUiSlider.create(eq2Slider, {
    start: [1000],
    snap: false,
    connect: 'lower',
    pips: eqPips,
    orientation: 'vertical',
    direction: 'rtl',
    range: {
        'min': 0,
        'max': 2000
    }
});


const audioContext = new AudioContext();

const analyser = audioContext.createAnalyser();
const distortion = audioContext.createWaveShaper();
const gainNode = audioContext.createGain();
const biquadFilter = audioContext.createBiquadFilter();
//const convolver = audioContext.createConvolver();

const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
//ctx.clearRect(0, 0, WIDTH, HEIGHT);

const draw = () => {
    const xOffset = 50;
    const yOffset = 50;
    let {width, height} = canvas.getBoundingClientRect();
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
    renderAxes(canvas);
    const drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    dataArray[0] = 0;
    dataArray[dataArray.length] = 0;
    //ctx.fillStyle = 'rgb(0, 0, 0)';
    //ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(180, 180, 180, 0.8)';
    ctx.beginPath();
    ctx.lineTo(xOffset, canvas.height - yOffset);
    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (v != 0) {
            if (i === 0) {
                ctx.moveTo(x * 4 + xOffset, height - y - yOffset);
            } else {
                ctx.lineTo(x * 4  + xOffset, height - y - yOffset);
            }
        }

        x += sliceWidth;
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(99, 170, 180, 0)';
    ctx.closePath();
    var gradient = ctx.createLinearGradient(255, 255, 255, 170);
    gradient.addColorStop(0, "rgba(99, 170, 180, 0)");
    gradient.addColorStop(.5, "rgba(80, 80, 80, 0.2)");
    gradient.addColorStop(1, "rgba(100, 100, 100, 0.2");
    ctx.fillStyle = gradient;

    ctx.fill();
    ctx.stroke();
}

draw();

track.connect(gainNode)
    .connect(distortion)
    .connect(biquadFilter)
    .connect(analyser)
    .connect(audioContext.destination);

/**
 * 
 * @param {int} freq 
 * @param {int} val 
 */
export const setBandOne = (type, freq, gain) => {
    biquadFilter.type = type;
    biquadFilter.frequency.setValueAtTime(freq, audioContext.currentTime);
    biquadFilter.gain.setValueAtTime(gain, audioContext.currentTime);
}

export const setBandOneQ = (val) => {
    const q = parseInt(val);
    biquadFilter.Q.value = q;
}



// select our play button
const playButton = document.querySelector('button');

playButton.addEventListener('click', function () {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

//const chart = buildChart();
let eqG = 0;
let eqF = 0;

gainSlider.noUiSlider.on('update', (val) => {
    gainNode.gain.value = val;
});

eq1Slider.noUiSlider.on('update', (val) => {
    const number = parseInt(val);
    eqG = number * 4;
    setBandOne("lowpass", eqF, eqG);
    //const data = chart.data.datasets[0].data;
    //data[0] = number;
    //addData(chart, data);
});


eq2Slider.noUiSlider.on('update', val => {
    const number = parseInt(val);
    eqF = number;
    //const data = chart.data.datasets[0].data;
    setBandOne("lowpass", eqF, eqG);
});


