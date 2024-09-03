//15
const readline = require('readline');

const mqtt = require("mqtt");
const options = {
  host: "bb6cb02830d2422e8e8d1eab115a6ce0.s1.eu.hivemq.cloud",
  protocol: 'mqtts',
  port: 8883,
  username: "Test1",
  password: "Test1234"
};
const client = mqtt.connect(options);

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
