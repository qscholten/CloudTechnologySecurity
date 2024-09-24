const { app } = require('@azure/functions');
const jsonlist = {Personen: 
    [{Naam: "Kwak"},
    {Naam: "Kwik"},
    {Naam: "Kwek"}]};

app.http('PersonenLijst', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'personen/{id:int?}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        var id = request.params.id - 1;
        var persoon = jsonlist.Personen[id];
        if (isNaN(id)) {
            context.log(`Verzoek tot opvragen gehele personenlijst.`)
            var textlist = JSON.stringify(jsonlist);
        }
        else if (id > jsonlist.Personen.length || id < 0) {
            context.log(`Verzoek tot opvragen van niet bestaand persoon!`)
            return {
                status: 404,
                body: "404! Deze persoon bestaat niet!"
            }
        }
        else {
            context.log(`Verzoek tot opvragen van persoon ${id}.`)
            var textlist = JSON.stringify(persoon);
        }
        return { body: `${textlist}` };
    }
});

app.http('PersonenToevoegen', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'personen',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);
        try {
            var bod = await request.text();
            var nieuwpersoon = JSON.parse(bod);
            if (!nieuwpersoon.hasOwnProperty("Naam")) {
                context.log("Poging tot toevoeging persoon zonder naam.")
                return {
                    status: 404
                }
            }
            else {
                jsonlist.Personen.push(nieuwpersoon);
                context.log(`Persoon toegevoegd: ${JSON.stringify(nieuwpersoon)}`);
                return {
                    status: 200,
                    body: `Persoon succesvol toegevoegd: ${JSON.stringify(nieuwpersoon)}`
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het verwerken van het toevoegen van een persoon`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij toevoegen van persoon.'
            }
        }
    }
});

app.http('PersonenAanpassen', {
    methods: ['PUT'],
    authLevel: 'function',
    route: 'personen/{id:int?}',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);
        try {
            var id = request.params.id - 1;
            if (isNaN(id) || id > jsonlist.Personen.length || id < 0) {
                context.log(`Poging tot wijzigen van niet bestaand persoon.`)
                return {
                    status: 400,
                    body: 'Persoon met dit id bestaat niet.'
                }
            }
            var bod = await request.json();
            var naam = bod.Naam;
            if (naam == null) {
                context.log("Poging tot verandering persoon zonder naam.")
                return {
                    status: 400,
                    body: 'Geen naam ingegeven.'
                }
            }
            else {
                var nieuwpersoon = {Naam: naam};
                jsonlist.Personen[id] = nieuwpersoon;
                context.log(`Persoon aangepast: ${JSON.stringify(nieuwpersoon)}`);
                return {
                    status: 200
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het verwerken van het veranderen van een persoon`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij veranderen van persoon.'
            }
        }
    }
});

app.http('PersonenVerwijderen', {
    methods: ['DELETE'],
    authLevel: 'function',
    route: 'personen/{id:int?}',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);
        try {
            var id = request.params.id - 1;
            if (isNaN(id) || id > jsonlist.Personen.length || id < 0) {
                context.log(`Poging tot verwijderen van niet bestaand persoon.`)
                return {
                    status: 400,
                    body: 'Persoon met dit id bestaat niet.'
                }
            }
            else {
                var verwijderpersoon = jsonlist.Personen[id];
                jsonlist.Personen.splice(id,1);
                context.log(`Persoon verwijderd: ${JSON.stringify(verwijderpersoon)}`);
                return {
                    status: 200
                }
            }
        }
        catch (e) {
            context.log(`Fout bij het verwerken van het verwijderen van een persoon`, e);
            return {
                status: 500,
                body: 'Interne serverfout bij verwijderen van persoon.'
            }
        }
    }
});