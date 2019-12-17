var context = new AudioContext(); //
var source;
var node = context.createScriptProcessor(2048, 1, 1);

var sourceBuffer, destination;
var audio, analyser, data;

var counter = 0;

var play = function(){
    if (!sourceBuffer){
        alert('Please upload audio');
        return;
    }
    var tableElements = document.querySelectorAll('table tr');
    if (tableElements.length == 0){
        alert('Please create table');
        return;
    }
        // создаем источник
    source = context.createBufferSource();
    // подключаем буфер к источнику
    source.buffer = sourceBuffer;

    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    data = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(node);
    node.connect(context.destination);
    source.connect(context.destination);

    node.onaudioprocess = function () {
        counter += 1;
        //if (counter % 15 === 0 || counter === 0){
            analyser.getByteFrequencyData(data);
            var tds = document.getElementsByTagName('td');

            for (var i = 0; i < tds.length; i++){
                var x = data[i];
                var random = Math.random() > 0.5 ? 1 : -1;
                var r = x + random * Math.random() * 100;
                var g = x + random * Math.random() * 100;
                var b = x + random * Math.random() * 100;
                tds[i].style.backgroundColor = 'rgb(' + [r, g ,b].join(',') + ')';
                //tds[i].style.backgroundColor = 'rgb(' + [x, x, x].join(',') + ')';
            }

        //}

    };

    source.onended = function(){
        node.onaudioprocess = null;
    }

    source.start(0);
    playBtn.disabled = true;
}

var loadBtn = document.getElementById('loadBtn');
var playBtn = document.getElementById('play');

playBtn.addEventListener("click", play);

//Load audio file listener
loadBtn.addEventListener("click", function() {
    var file = document.getElementById('audio-file').files[0];
    if(file == undefined) {
        return false;
    }
    var reader1 = new FileReader();
    reader1.onload = function(ev) {
        // Decode audio
        context.decodeAudioData(ev.target.result).then(function(buffer) {
            sourceBuffer = buffer;
        });
    };
    reader1.readAsArrayBuffer(file);
}, false);

var showTableButton = document.getElementById('showTableButton');
showTableButton.onclick = function showTable(){
    var tableWidth = document.getElementById('tableWidth').value;
    var tableHeight = document.getElementById('tableHeight').value;
    if (tableWidth != null && tableHeight != null ){
        tableWidth = parseInt(tableWidth);
        tableHeight = parseInt(tableHeight);
        if (Number.isInteger(tableWidth) && Number.isInteger(tableHeight)){
            drawTable(tableWidth, tableHeight);
        } else {
            alert('Please enter integer numbers');
            return;
        }
    } else{
        alert('Please enter integer numbers');
        return;
    }
    showTableButton.disabled = true;
}

function drawTable(tableWidth, tableHeight) {
    var table = document.getElementById('table');
    for (var i = 0; i<tableHeight; i++){
        var tr = document.createElement('TR');
        for (var j = 0; j<tableWidth; j++){
            var td = document.createElement('TD');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
