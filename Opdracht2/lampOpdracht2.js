
//16
const mqtt = require("mqtt");
const options = {
    host: "bb6cb02830d2422e8e8d1eab115a6ce0.s1.eu.hivemq.cloud",
    protocol: 'mqtts',
    port: 8883,
    username: "Test1",
    password: "Test1234"
};
const client = mqtt.connect(options);

var lampstatus = 0;

//17
function lampuit() {
    lampstatus = 0;
    console.log("Lamp is uit.")
}

client.subscribe("Beweging");

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
        var tijd = 5000;
        if (isNaN(jsonmessage.tijd)) {
            tijd = 5000;
        }
        else {
            tijd = jsonmessage.tijd;
        }
        const mytimeout = setTimeout(function(){lampuit()}, tijd);
    }
    else if (lampstatus == 0) {
        console.log("Lamp is uit.")
    }
  });

  