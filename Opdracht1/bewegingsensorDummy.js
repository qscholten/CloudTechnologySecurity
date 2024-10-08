//15
const readline = require('readline');

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:broker.mqttdashboard.com");

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
});
client.subscribe("Beweging");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Press enter voor beweging");

rl.on('line', (input) => {
  //console.log(`Received: ${input}`);
  console.log("Er is beweging geconstateerd");
  let text = '{"lichtsterkte" : "255"}';
  client.publish("Beweging", text);
  //17
  /*
  setTimeout(() => {
    console.log("Geen beweging meer gedetecteerd.");
    client.publish("Beweging", '{"lichtsterkte" : "0"}');
  }, 5000);
  */
});
