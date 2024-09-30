const { app } = require('@azure/functions');

app.http('AlarmIOT', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'alarm2/{id:int?}',
    handler: async (request, context) => {
        var Client = require('azure-iothub').Client;
        var connectionString = 'HostName=KwiksHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=XgO29InUL2JBZC+36ZG5VyTBgsx28M2XGAIoTHRAOI4='//process.env.IOTHUB_CONNECTION_STRING;
        var client = Client.fromConnectionString(connectionString);
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            var id = request.params.id;
            if (id == 1) {
                var bod = await request.json();
                var text = JSON.stringify(bod);
                text = JSON.parse(text);
                var methodParams = {
                    methodName: text.method,
                    payload: text.payload,
                    responseTimeoutInSeconds: 15
                }
                var targetDevice = "NewAlarm";
                client.invokeDeviceMethod(targetDevice, methodParams, function (err, result) {
                    if (err) {
                        console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
                    }
                    else {
                        console.log(methodParams.methodName + ' on ' + targetDevice + ':');
                        console.log(JSON.stringify(result, null, 2));
                    }
                })
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

var alarms = {
    "Alarms": [
        {
            "Method": "MQTT",
            "Name": "Alarmlicht"
        },
        {
            "Method": "Azure",
            "Name": "NewAlarm"
        }
    ]
}

app.http('AlarmAzureIOT', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'alarm/{id:int?}',
    handler: async (request, context) => {
        var Client = require('azure-iothub').Client;
        var connectionString = 'HostName=KwiksHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=XgO29InUL2JBZC+36ZG5VyTBgsx28M2XGAIoTHRAOI4='//process.env.IOTHUB_CONNECTION_STRING;
        var client = Client.fromConnectionString(connectionString);
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            var id = request.params.id - 1;
            if (id < alarms.Alarms.length) {
                var bod = await request.json();
                var text = JSON.stringify(bod);
                text = JSON.parse(text);
                if (alarms.Alarms[id].Method === "MQTT"){
                    const mqtt = require("mqtt");
                    const clientmqtt = mqtt.connect("mqtt:broker.mqttdashboard.com");
                    var temptext = JSON.stringify(bod);
                    clientmqtt.publish(alarms.Alarms[id].Name, temptext);
                    return {
                        status: 200
                    }
                }
                else if (alarms.Alarms[id].Method === "Azure") {
                var methodParams = {
                    methodName: "change",
                    payload: text.payload,
                    responseTimeoutInSeconds: 15
                }
                    client.invokeDeviceMethod(alarms.Alarms[id].Name, methodParams, function (err, result) {
                        if (err) {
                            console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
                        }
                        else {
                            console.log(methodParams.methodName + ' on ' + targetDevice + ':');
                            console.log(JSON.stringify(result, null, 2));
                        }
                    })
                }
                else {
                    return {
                        status: 500,
                        body: 'Interne serverfout bij aansturen van alarm.'
                    }
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

app.http('AlarmGET', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'alarm/{id:int?}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        var id = request.params.id - 1;
        var al = alarms.Alarms[id];
        if (isNaN(id)) {
            context.log(`Verzoek tot opvragen gehele alarmlijst.`);
            var textlist = JSON.stringify(alarms);
        }
        else if (id > alarms.Alarms.length || id < 0) {
            context.log(`Verzoek tot opvragen van niet bestaand alarm!`)
            return {
                status: 404,
                body: "404! Dit alarm bestaat niet!"
            }
        }
        else {
            context.log(`Verzoek tot opvragen van alarm ${id}.`)
            var textlist = JSON.stringify(al);
        }
        return { 
            status: 200,
            body: `${textlist}` };
    }
})

app.http('AlarmToevoegen', {
    methods: ['Post'],
    authLevel: 'anonymous',
    route: 'alarm',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            var bod = await request.text();
            var nieuwalarm = JSON.parse(bod);
            if (!nieuwalarm.hasOwnProperty("Method")) {
                context.log("Poging tot toevoeging alarm zonder methode van communicatie.");
                return {
                    status: 404,
                    body: "Een alarm kan niet toegevoegd worden zonder methode van communicatie."
                }
            }
            else if (!nieuwalarm.hasOwnProperty("Name")) {
                context.log("Poging tot toevoeging alarm zonder naam.");
                return {
                    status: 404,
                    body: "Een alarm kan niet toegevoegd worden zonder naam."
                }
            }
            else {
                alarms.Alarms.push(nieuwalarm);
                context.log(`Alarm toegevoegd: ${JSON.stringify(nieuwalarm)}`);
                return{
                    status: 200,
                    body: `Alarm succesvol toegevoegd: ${JSON.stringify(nieuwalarm)}` 
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het verwerken van het toevoegen van een alarm`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij toevoegen alarm.'
            }
        }
    }
});