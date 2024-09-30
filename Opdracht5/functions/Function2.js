const { app } = require('@azure/functions');

app.http('Function2', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const parameter = request.query.get('parameter');
        if (parameter === null) {
            context.log("Error! Parameter ontbreekt!");
            return {
                status: 500,
                body: "Error! Je hebt parameter niet meegegeven!"
            }
        }
        return { body: `Hello, je parameter is ${parameter}!` };
    }
});
