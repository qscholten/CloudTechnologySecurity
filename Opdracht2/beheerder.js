const mqtt = require("mqtt");
const readline = require('readline');
const client = mqtt.connect("mqtt:broker.mqttdashboard.com");

client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message}`);
  });
  client.subscribe("lamp");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var send = 0;
var lichtsterkte = 0;
var tijd = 5000;
var kamer = "All";

rl.setPrompt(`Welke lampen wil je aanzetten? (Woonkamer, Zolder, All)\n`);
rl.prompt()
rl.on('line', (input) => {
    if (send == 0) {
        kamer = input.toLowerCase();
        if (kamer == 'all') {
            kamer = "lamp/lamp";
        }
        rl.setPrompt("Wat is de lichtsterkte in procenten?\n");
        rl.prompt();
        send = 1;
    }
    else if (send == 1) {
        lichtsterkte = 255 * (input/100);
        rl.setPrompt("Wat is de tijd in seconden?\n");
        rl.prompt();
        send = 2;
    }
    else {
        tijd = input*1000;
        let text = '{"lichtsterkte" : "'+ lichtsterkte + '", "tijd" : "' + tijd + '"}';
        client.publish(`home/${kamer}`, text);
        send = 0;
        rl.setPrompt(`Welke lampen wil je aanzetten? (Woonkamer, Zolder, All)\n`);
        rl.prompt();
    }
});
