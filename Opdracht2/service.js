const mqtt = require("mqtt");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
var sensortopic = "";
var lamptopic = "";
var broker = "broker.mqttdashboard.com"; 
var timeout = null;
rl.question("Wat is het adres van de broker?\n", (answer) => {
    var broker = answer;
    rl.question("Wat is het topic van de sensor?\n", (sensor) => {
        sensortopic = sensor;
        client.subscribe(sensortopic);
        rl.question("Wat is het topic van de lamp?\n", (lamp) => {
            lamptopic = lamp;
        })
    })
});
const client = mqtt.connect(`mqtt:${broker}`); //default broker.mqttdashboard.com

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  if (topic == sensortopic) {
    client.publish(lamptopic, "LampAan");
    console.log("Lamp aan.");
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        client.publish(lamptopic, "LampUit");
        console.log("Lamp uit.");
    }, 5000)
  }
});
