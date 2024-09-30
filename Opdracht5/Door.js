// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Choose a protocol by uncommenting one of these transports.
const Protocol = require('azure-iot-device-mqtt').Mqtt;
// const Protocol = require('azure-iot-device-amqp').Amqp;
// const Protocol = require('azure-iot-device-http').Http;
// const Protocol = require('azure-iot-device-mqtt').MqttWs;
// const Protocol = require('azure-iot-device-amqp').AmqpWs;

const Client = require('azure-iot-device').Client;
let client = null;
var deurstatus = "open";

function main() {
    // open a connection to the device
    const deviceConnectionString = "HostName=KwiksHub.azure-devices.net;DeviceId=NewDoor;SharedAccessKey=/b9fYwFhQYbnIbK9x4rSc4v+TgtkmLxh2AIoTN89WOQ="//process.env.IOTHUB_DEVICE_CONNECTION_STRING_DOOR;
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
        client.onDeviceMethod('getDeviceLog', onGetDeviceLog);
        client.onDeviceMethod('lockDoor', onLockDoor);
        client.onDeviceMethod('doorStatus', onDoorStatus);
        client.onDeviceMethod('changeStatus', onChangeStatus);
    }
}

function onChangeStatus(request, response) {
    printDeviceMethodRequest(request);
    var newstatus = "";
    var antwoord = "";
    // Implement actual logic here.
    /*
    try {
        newstatus = JSON.parse(request.payload);
    }
    catch (e) {
        console.error('An error ocurred when changing door status:\n' +
            err.toString());
    }*/
    newstatus = request.payload;
    console.log(newstatus.status);
    if (newstatus.status=="open") {
        if (deurstatus == "open") {
            antwoord = "Deur is al open.";
        }
        else {
            antwoord = "Deur is nu open.";
            deurstatus = "open";
        }
    }
    else if (newstatus.status=="dicht") {
        if (deurstatus == "dicht") {
            antwoord = "Deur is al dicht.";
        }
        else {
            antwoord = "Deur is nu dicht.";
            deurstatus = "dicht";
        }
    }
    // complete the response
    response.send(200, antwoord, function (err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        } else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function onGetDeviceLog(request, response) {
    printDeviceMethodRequest(request);

    // Implement actual logic here.

    // complete the response
    response.send(200, 'example payload', function (err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        } else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function onLockDoor(request, response) {
    printDeviceMethodRequest(request);

    // Implement actual logic here.

    // complete the response
    response.send(200, function (err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        } else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function onDoorStatus(request, response) {
    printDeviceMethodRequest(request);
    var payload = JSON.stringify({ status: deurstatus })
    response.send(200, payload, function(err) {
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

function printDeviceMethodRequest(request) {
    // print method name
    console.log('Received method call for method \'' + request.methodName + '\'');

    // if there's a payload just do a default console log on it
    if(request.payload) {
        console.log('Payload:\n' + request.payload);
    }
}

// get the app rolling
main();

