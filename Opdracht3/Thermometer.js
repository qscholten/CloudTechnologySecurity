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
const Message = require('azure-iot-device').Message;
const iothub = require('azure-iothub');

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
const deviceConnectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING_THERMOMETER;
let sendInterval;

function disconnectHandler() {
  clearInterval(sendInterval);
  sendInterval = null;
  client.open().catch((err) => {
    console.error(err.message);
  });
}

// The AMQP and HTTP transports have the notion of completing, rejecting or abandoning the message.
// For example, this is only functional in AMQP and HTTP:
// client.complete(msg, printResultFor('completed'));
// If using MQTT calls to complete, reject, or abandon are no-ops.
// When completing a message, the service that sent the C2D message is notified that the message has been processed.
// When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
// When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
// MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
function messageHandler(msg) {
  console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
  client.complete(msg, printResultFor('completed'));
}

function generateMessage(temperature) {
    var data = '';
    if (temperature >= desiredtemperature) {
        data = "Het is " + temperature + " graden. Lekker warm!";
    }
    else {
        data = "Het is " + temperature + " graden. Let op! Te koud!";
    }
  const message = new Message(data);
  return message;
}

function errorHandler(err) {
  console.error(err.message);
}

var desiredtemperature = "";

function connectHandler() {
  console.log('Client connected');
  // Get the temperature every five seconds. If it is below desired temperature, it will send the temperature and a warning. Else it will send a positive message.
  if (!sendInterval) {
    sendInterval = setInterval(() => {
        const temperature = (Math.random() * 30);
        const message = generateMessage(temperature);
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
    }, 5000);
  }
}

// fromConnectionString must specify a transport constructor, coming from any transport package.
let client = Client.fromConnectionString(deviceConnectionString, Protocol);

client.on('connect', connectHandler);
client.on('error', errorHandler);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);

client.open()
.catch((err) => {
  console.error('Could not connect: ' + err.message);
});

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
const registry = iothub.Registry.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
registry.getTwin("NewThermometer", (err, twin) => {
    if (err) {
      console.error('Fout bij het ophalen van de twin:', err);
    } else {
      desiredtemperature = twin.properties.desired.temperature;
    }
  });