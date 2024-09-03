
//16
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:broker.mqttdashboard.com");

var lampstatus = 0;

//17
function lampuit() {
    lampstatus = 0;
    console.log("Lamp is uit.")
}

client.on('message', (topic, message) => {
    const jsonmessage = JSON.parse(message);
    if (isNaN(jsonmessage.lichtsterkte)) {
        console.log("Ongeldige lichtsterkte ontvangen!");
    }
    else {
        lampstatus = jsonmessage.lichtsterkte;
    }
    if (lampstatus > 0){ 
        console.log(`Lamp is aan met lichtsterkte ${lampstatus}.`);
          //17
        const mytimeout = setTimeout(function(){lampuit()}, 5000);
    }
    else if (lampstatus == 0) {
        console.log("Lamp is uit.")
    }
  });
  client.subscribe("Beweging");


  