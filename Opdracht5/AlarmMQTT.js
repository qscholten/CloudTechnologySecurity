const chalk = require('chalk');
const { stdin: input, stdout: output } = require('node:process');

const mqtt = require("mqtt");
const { clear } = require('node:console');
const client = mqtt.connect("mqtt:broker.mqttdashboard.com");
client.subscribe('Alarmlicht');

process.stdout.write("aan");
toggle = false;
var myinterval = setInterval(print, 1000);
var rood = 0;
var groen = 255;
var blauw = 0;

function isJSON(string) {
    try {
        JSON.parse(string);
        return true;
    }
    catch(e) {
        return false;
    }
}

function print() {
    process.stdout.cursorTo(0);
    if (toggle) { 
        process.stdout.write("   ");
    }
    else {
        process.stdout.write(chalk.rgb(rood,groen,blauw)("aan"));
    }
    toggle= (!toggle);
}

client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message}`);
    var jsonmessage = "";
    if (isJSON(message)) {
        jsonmessage = JSON.parse(message);
    }
    if (!isNaN(jsonmessage.payload.red)) {
        rood = jsonmessage.payload.red;
    }
    if (!isNaN(jsonmessage.payload.green)) {
        groen = jsonmessage.payload.green;
    }
    if (!isNaN(jsonmessage.payload.blue)) {
        blauw = jsonmessage.payload.blue;
    }
    if (!isNaN(jsonmessage.payload.frequency)) {
        clearInterval(myinterval);
        myinterval = setInterval(print, jsonmessage.payload.frequency)
    }
    else {
        clearInterval(myinterval);
        myinterval = setInterval(print, 1000)
    }
    if (!isNaN(jsonmessage.aanuit) && jsonmessage.aanuit == 0) {
        clearInterval(myinterval);
    }
  });