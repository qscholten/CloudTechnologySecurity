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
    if (!isNaN(jsonmessage.rood)) {
        rood = jsonmessage.rood;
    }
    if (!isNaN(jsonmessage.groen)) {
        groen = jsonmessage.groen;
    }
    if (!isNaN(jsonmessage.blauw)) {
        blauw = jsonmessage.blauw;
    }
    if (!isNaN(jsonmessage.frequentie)) {
        clearInterval(myinterval);
        myinterval = setInterval(print, jsonmessage.frequentie)
    }
    else {
        clearInterval(myinterval);
        myinterval = setInterval(print, 1000)
    }
    if (!isNaN(jsonmessage.aanuit) && jsonmessage.aanuit == 0) {
        clearInterval(myinterval);
    }
  });