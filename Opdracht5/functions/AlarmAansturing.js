const { app } = require('@azure/functions');

app.http('MQTTPublish', {
    methods: ['POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        const mqtt = require("mqtt");
        const client = mqtt.connect("mqtt:broker.mqttdashboard.com");
        var publishtopic = "Alarmlicht";

        context.log(`Http function processed request for url "${request.url}"`);

        let text = "Test";
        client.publish(publishtopic, text);

        return { body: `Publish is verzonden: ${text}!` };
    }
});

app.http('AlarmAansturing', {
    methods: ['PUT'],
    authlevel: 'function',
    route: 'alarm3/{id:int?}',
    handler: async (request, context) => {
        const mqtt = require("mqtt");
        const client = mqtt.connect("mqtt:broker.mqttdashboard.com");
        const alarmlichten = ["Alarmlicht", "Alarmlicht2"]
        var publishtopic = "Alarmlicht";

        context.log(`Http function processed request for url "${request.url}"`);

        try {
            var id = request.params.id - 1;
            if (id < alarmlichten.length) {
                var bod = await request.json();
                var text = JSON.stringify(bod);
                client.publish(alarmlichten[id], text);
                return {
                    status: 200
                }
            }
            else {
                return {
                    status: 404,
                    body: `Alarm met ID ${id} bestaat niet.`
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het aansturen van het alarm`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij aansturen van alarm.'
            }
        }
    }
});



app.http('LeesBestand', {
    methods: ['GET'],
    authlevel: 'function',
    route: 'leesbestand',
    handler: async (request, context) => {
        async function ReadFile() {
            var fs = require ('fs/promises');
            try {
                const data = await fs.readFile('package.json');
                console.log(`Bestandsinhoud: ${data}`);
            }
            catch (e) {
                console.log(`Error bij het lezen van bestand: ${e}`);
            }
        }
        
        ReadFile();
        console.log("Hey Ho")
    }
})