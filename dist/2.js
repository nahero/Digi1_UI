// connection option
const options = {
    // clean: true, // retain session
connectTimeout: 10000, // Timeout period
// Authentication information
clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
// username: '',
// password: '',
}

// Connect string, and specify the connection method by the protocol
// ws Unencrypted WebSocket connection
// wss Encrypted WebSocket connection
// mqtt Unencrypted TCP connection
// mqtts Encrypted TCP connection
// wxs WeChat applet connection
// alis Alipay applet connection
const connectUrl = 'mqtt://192.168.1.11:1883';
const client = mqtt.connect(connectUrl, options);

client.on('reconnect', (error) => {
console.log('reconnecting:', error);
})

client.on('error', (error) => {
console.log('Connection failed:', error);
})

client.on('message', (topic, message) => {
console.log('receive message：', topic, message.toString());
})