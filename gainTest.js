// あらかじめgetUserMediaのポリフィルが読み込まれています
// https://github.com/lig-dsktschy/ligfes20160426/blob/gh-pages/01/js/getusermedia-commented.js

'use strict';

var ctx, analyser, frequencies, getByteFrequencyDataAverage, elLogo, draw;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
ctx = new AudioContext();

analyser = ctx.createAnalyser();
frequencies = new Uint8Array(analyser.frequencyBinCount);

getByteFrequencyDataAverage = function () {
    analyser.getByteFrequencyData(frequencies);
    return frequencies.reduce(function (previous, current) {
        return previous + current;
    }) / analyser.frequencyBinCount;
};

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        window.hackForMozzila = stream;
        ctx.createMediaStreamSource(stream)
            // AnalyserNodeに接続
            .connect(analyser);
    })
    .catch(function (err) {
        console.log(err.message);
    });

// 透明度を変更する要素
elLogo = document.getElementById('logo');
// 可能な限り高いフレームレートで音量を取得し、透明度に反映する
(draw = function () {
    // opacityの範囲である0〜1に変換
    elLogo.style.opacity = getByteFrequencyDataAverage() / 255;
    requestAnimationFrame(draw);
})();