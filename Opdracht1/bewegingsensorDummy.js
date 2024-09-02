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
  client.publish("Beweging", "255");
  //17
  /*
  setTimeout(() => {
    console.log("Geen beweging meer gedetecteerd.");
    client.publish("Beweging", "0");
  }, 5000);
  */
});
