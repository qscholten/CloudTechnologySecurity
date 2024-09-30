const { app } = require('@azure/functions');

var deuren = {"Deuren": [
    {
        "Name": "NewDoor"
    }
]}

app.http('DeurAansturing', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'deur/{id:int?}',
    handler: async (request, context) => {
        var Client = require('azure-iothub').Client;
        var connectionString = 'HostName=KwiksHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=XgO29InUL2JBZC+36ZG5VyTBgsx28M2XGAIoTHRAOI4='//process.env.IOTHUB_CONNECTION_STRING;
        var client = Client.fromConnectionString(connectionString);
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            var id = request.params.id - 1;
            if (id < deuren.Deuren.length) {
                var bod = await request.json();
                var text = JSON.stringify(bod);
                text = JSON.parse(text);
                var methodParams = {
                    methodName: "changeStatus",
                    payload: text.payload,
                    responseTimeoutInSeconds: 15
                }
                console.log(deuren.Deuren[id].Name);
                var result = await client.invokeDeviceMethod(deuren.Deuren[id].Name, methodParams);
                console.log(result.result);
                return {
                    status: 200,
                    body: JSON.stringify(result.result)
                }
            }
            else {
                return {
                    status: 404,
                    body: `Deur met ID ${id+1} bestaat niet.`
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het aansturen van de deur`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij aansturen van deur.'
            }
        }
    }
});
