if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW registered.");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration error!");
        console.log(error);
    });
}

// Start Websocket
let socket = new WebSocket("ws://192.168.1.115:80");

socket.onopen = function(e) {
    console.log("Connection established");
    socket.send("Hello from Browser");
};

socket.onmessage = function(event) {
    console.log("Message received: " + event.data);
    let msg = event.data;
    
    // check if message is in JSON format and JSON.parse if true
    if (msg.indexOf("{") == 0) {
        let msgObj = JSON.parse(event.data);
        console.log("msgObj: ", msgObj);
        
        if(msgObj.filter) {
            recFilter(msgObj.filter);
        }
        else if (msgObj.volume) {
            recVolume(msgObj.volume);
        }
        else if (msgObj.mode) {
            recMode(msgObj.mode);
        }
        else if (msgObj.sr) {
            recSR(msgObj.sr);
        }
        else if (msgObj.ssid) {
            recSSID(msgObj.ssid, msgObj.IPaddress);
        }
        else if (msgObj.rssi) {
            recRSSI(msgObj.rssi);
        }
        else if (msgObj.xo) {
            recXO(msgObj.xo, msgObj.freq);
        }
        else if (msgObj.delay) {
            recDelay(msgObj.delay);
        }
    }
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
let ssidObj = {"ssid": "not connected", "IPaddress" : "192.168.0.0"};
let rssiObj = {"rssi": "-60"};
let filterObj = {"filter": 2};
let volumeObj = {"volume": 225};
let volMinMax = {"min": 200, "max": 255};
let volRange = volMinMax.max - volMinMax.min;
let filters = [
    {
        "filter": 1,
        "name": "Sharp Roll-off",
        "gd" : "28.8",
        "filterResponse" : "SharpRolOff_FR.jpg",
        "filterRipple" : "SharpRolOff_PR.jpg"
    },
    {
        "filter": 2,
        "name": "Slow Roll-off",
        "gd" : "6.00",
        "filterResponse" : "SlowRolOff_FR.jpg",
        "filterRipple" : "SlowRolOff_PR.jpg"
    },
    {
        "filter": 3,
        "name": "Short delay sharp roll off",
        "gd" : "5.63",
        "filterResponse" : "SDSharpRolOff_FR.jpg",
        "filterRipple" : "SDSharpRolOff_PR.jpg"
    },
    {
        "filter": 4,
        "name": "Short delay slow roll off",
        "gd" : "4.68",
        "filterResponse" : "SDSlowRolOff_FR.jpg",
        "filterRipple" : "SDSlowRolOff_PR.jpg"
    }
];

// Get all element selectors
const networkSSID = document.querySelector('#networkSSID');
const IPaddress = document.querySelector('#IPaddress');
const networkRSSI = document.querySelector('#networkRSSI');
const mode = document.querySelector('#mode');
const sampleRate = document.querySelector('#sampleRate');
const volumeDisplay = document.querySelector('#volumeDisplay');
const volumeSlider = document.querySelector('#volumeSlider');
const volumeBtns = document.querySelectorAll('.volumeBtn');
const filterBtns = document.querySelectorAll('.filterBtn');
const filterValDisplay = document.querySelector('#filter_val');
const filterNameDisplay = document.querySelector('#filter_name');


// SET VOLUME
volumeSlider.addEventListener('change', event => {
    let newValue = parseInt(event.target.value);
    volumeObj.volume = constrain(newValue, volMinMax.min, volMinMax.max);
    console.log("volumeObj: ", volumeObj);
    socket.send(JSON.stringify(volumeObj));
    setVolumeDisplay();
    updateVolumeProgressBar();
});

volumeSlider.addEventListener('touchmove', event => { // for mobile devices
    updateVolumeProgressBar();
});
volumeSlider.addEventListener('mousemove', event => { // for desktop
    updateVolumeProgressBar();
});
volumeBtns.forEach(item => {
    item.addEventListener('click', event => {
        let newValue = (volumeObj.volume += parseInt(event.target.value));
        volumeObj.volume = constrain(newValue, volMinMax.min, volMinMax.max);
        console.log("volumeObj: ", volumeObj);
        socket.send(JSON.stringify(volumeObj));
        setVolumeDisplay();
        updateVolumeSlider();
        updateVolumeProgressBar();
    });
});

// SET FILTER
filterBtns.forEach(item => {
    item.addEventListener('click', event => {
        filterObj.filter = event.target.value;
        console.log("filterObj: ", filterObj);
        console.log("filterObjSTRING: ", JSON.stringify(filterObj));
        // socket.send(JSON.stringify(filterObj));
        // set "active" class to proper filterBtn
        updateFilterDisplay();
    });
  });

// Set volume display
function setVolumeDisplay() {
    volumeDisplay.textContent = volumeObj.volume;
}
// Update volume input
function updateVolumeSlider() {
    volumeSlider.value = volumeObj.volume;
}
// Update volume progress bar color fill
function updateVolumeProgressBar() {
    let x = (volumeSlider.value - volMinMax.min) / volRange * 100;
    // let x = (volumeObj.volume - volMinMax.min) / volRange * 100;
    let progressGradient = 'linear-gradient(90deg, rgb(245, 158, 11) '+x+'%, rgb(64,64,64) '+x+'%)';
    volumeSlider.style.background = progressGradient;
}
// Update filter displays
function updateFilterDisplay() {
    // get current filter btn by querying class "f1" to "f4"
    const currentFilter = document.querySelector('.f'+filterObj.filter);
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    currentFilter.classList.add('active');
    // display filter value and name
    filterValDisplay.textContent = filterObj.filter;
    filterNameDisplay.textContent = filters[filterObj.filter-1].name + ", GD: " + filters[filterObj.filter-1].gd;
}

// Update Network display
function updateNetworkDisplay() {
    networkSSID.textContent = ssidObj.ssid;
    IPaddress.textContent = ssidObj.IPaddress;
}
// Update Network display
function updateRSSIDisplay() {
    networkRSSI.textContent = rssiObj.rssi + "dB";
}

// Constrain to min/max range
function constrain(num, min, max) {
    const MIN = min;
    const MAX = max;
    const parsed = parseInt(num);
    return Math.min(Math.max(parsed, MIN), MAX);
}

// Receive volume from device
function recVolume(value) {
    let newValue = parseInt(value);
    volumeObj.volume = constrain(newValue, volMinMax.min, volMinMax.max);
    setVolumeDisplay();
    updateVolumeSlider();
}
// Receive filter from device
function recFilter(value) {
    filterObj.filter = parseInt(value);
    updateFilterDisplay();
}
// Receive SSID from device
function recSSID(ssid, IPaddress) {
    ssidObj.ssid = ssid;
    ssidObj.IPaddress = IPaddress;
    updateNetworkDisplay();
}
// Receive signal strength from device
function recRSSI(value) {
    rssiObj.rssi = value;
    updateRSSIDisplay();
}
// Receive sound mode from device
// Receive sample rate from device
// Receive crystal info from device
// Receive delay info from device