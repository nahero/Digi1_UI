// Start Websocket
let socket = new WebSocket("ws://192.168.1.115:80");

socket.onopen = function(e) {
    console.log("Connection established");
    socket.send("Hello from Browser");
};

socket.onmessage = function(event) {
    console.log("Message received: " + event.data);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log("Websocket closed cleanly. Closing code: " + event.code + 
        ", Reason: " + event.reason);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("Websocket closed - NOT CLEAN. Closing code: " + event.code + 
        ", Reason: " + event.reason);
    }
};

socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};

// Create objects for storing values
let ssidObj = {"ssid": "NajOptimalnije"};
let signalObj = {"signal": "-60"};
let filterObj = {"filter": 2};
let volumeObj = {"volume": 220};
let volMinMax = {"min": 200, "max": 255};

// Get all element selectors
const networkSSID = document.querySelector('#networkSSID');
const signalStrength = document.querySelector('#signalStrength');
const mode = document.querySelector('#mode');
const sampleRate = document.querySelector('#sampleRate');
const volumeDisplay = document.querySelector('#volumeDisplay');
const volumeInput = document.querySelector('#volumeInput');
const volumeBtns = document.querySelectorAll('.volumeBtn');
const filterBtns = document.querySelectorAll('.filterBtn');

// SET FILTER
filterBtns.forEach(item => {
    item.addEventListener('click', event => {
        filterObj.filter = event.target.value;
        console.log("filterObj: ", filterObj);
        socket.send(JSON.stringify(filterObj));
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        })
        event.target.classList.add('active');
    });
  });
  
// SET VOLUME
volumeInput.addEventListener('change', event => {
    let newValue = parseInt(event.target.value);
    volumeObj.volume = constrain(newValue, volMinMax.min, volMinMax.max);
    console.log("volumeObj: ", volumeObj);
    socket.send(JSON.stringify(volumeObj));
    setVolumeDisplay();
});
volumeBtns.forEach(item => {
    item.addEventListener('click', event => {
        let newValue = (volumeObj.volume += parseInt(event.target.value));
        volumeObj.volume = constrain(newValue, volMinMax.min, volMinMax.max);
        console.log("volumeObj: ", volumeObj);
        socket.send(JSON.stringify(volumeObj));
        setVolumeDisplay();
        updateVolumeInput();
    });
});

// Set volume display
function setVolumeDisplay() {
    volumeDisplay.textContent = volumeObj.volume;
}
// Update volume input
function updateVolumeInput() {
    volumeInput.value = volumeObj.volume;
}

// Constrain to min/max range
function constrain(num, min, max) {
    const MIN = min;
    const MAX = max;
    const parsed = parseInt(num);
    return Math.min(Math.max(parsed, MIN), MAX);
}