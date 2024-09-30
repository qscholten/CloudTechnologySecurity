/*var fs = require ('fs');
fs.readFile('file.txt', function(e, data) {
    if (e) {
        console.log(`Error bij het lezen van bestand: ${e}`);
        return;
    }
    else {
        console.log(`Bestandsinhoud: ${data}`);
        return;
    }
});
console.log("Hey Ho");*/

async function ReadFile() {
    var fs = require ('fs/promises');
    try {
        const data = await fs.readFile('file.txt');
        console.log(`Bestandsinhoud: ${data}`);
    }
    catch (e) {
        console.log(`Error bij het lezen van bestand: ${e}`);
    }
}

ReadFile();
console.log("Hey Ho")