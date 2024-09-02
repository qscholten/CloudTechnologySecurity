//12
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:broker.mqttdashboard.com");

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
});

client.publish("Kwik", "Hello mqtt");
//13
client.subscribe("Kwik");


