'use strict';

const Protocol = require('azure-iot-device-mqtt').Mqtt;

const Client = require('azure-iot-device').Client;
let client = null;
const chalk = require('chalk');
var myinterval = "";

function main() {
    // open a connection to the device
    const deviceConnectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING_ALARM;
    client = Client.fromConnectionString(deviceConnectionString, Protocol);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    client.open(onConnect);
}

function onConnect(err) {
    if(err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Connected to device. Registering handlers for methods.');

        // register handlers for all the method names we are interested in
        client.onDeviceMethod('changeColour', onChangeColour);
        client.onDeviceMethod('changeFrequency', onChangeFrequency);
        process.stdout.write("aan");
        myinterval = setInterval(print, 1000);
    }
}

var toggle = false;
var red = 0;
var green = 255;
var blue = 0;

function print() {
    process.stdout.cursorTo(0);
    if (toggle) { 
        process.stdout.write("   ");
    }
    else {
        process.stdout.write(chalk.rgb(red,green,blue)("aan"));
    }
    toggle= (!toggle);
}

function printDeviceMethodRequest(request) {
    // print method name
    console.log('Received method call for method \'' + request.methodName + '\'');

    // if there's a payload just do a default console log on it
    if(request.payload) {
        console.log('Payload:\n' + request.payload);
    }
}

function onChangeColour(request, response) { 
    printDeviceMethodRequest(request);
    var check = "";
    if (!isNaN(request.payload.red)) {
        red = request.payload.red;
        check = check + "Rood is veranderd naar " + red + ". ";
    }
    if (!isNaN(request.payload.green)) {
        green = request.payload.green;
        check = check + "Groen is veranderd naar " + green + ". ";
    }
    if (!isNaN(request.payload.blue)) {
        blue = request.payload.blue;
        check = check + "Blauw is veranderd naar " + blue + ". ";
    }
    response.send(200, check, function(err) {
        if (err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        }
        else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function onChangeFrequency(request, response) {
    printDeviceMethodRequest(request);
    if (!isNaN(request.payload.frequency)) {
        clearInterval(myinterval);
        myinterval = setInterval(print, request.payload.frequency);
    }
    response.send(200, "De frequentie is veranderd naar " + request.payload.frequency, function(err) {
        if (err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        }
        else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}
main();