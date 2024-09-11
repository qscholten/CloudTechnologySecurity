// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Client = require('azure-iothub').Client;
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var connectionString = process.env.IOTHUB_CONNECTION_STRING;
var targetDevice = "NewDoor";
var client = Client.fromConnectionString(connectionString);

var send = 0;
var methode = "";
var payload = "";
rl.setPrompt(`Welke methode wil je aanroepen? (getDeviceLog, doorStatus, changeStatus of lockDoor)\n`);
rl.prompt();
rl.on('line', (input) => {
  if (send == 0) {
      methode = input.toLowerCase();
      if (methode == 'getdevicelog') {
          methode = "getDeviceLog";
      }
      else if (methode == 'lockdoor') {
        methode = 'lockDoor';
      }
      else if (methode == 'doorstatus') {
        methode = 'doorStatus';
      }
      else if (methode == 'changestatus') {
        methode = 'changeStatus';
      }
      rl.setPrompt("Welke boodschap wil je meegeven?\n");
      rl.prompt();
      send = 1;
  }
  else if (send == 1) {
      rl.setPrompt("Welke methode wil je aanroepen? (getDeviceLog, doorStatus, changeStatus of lockDoor)\n");
      rl.prompt();
      send = 0;
      payload = input;
      var methodParams = {
        methodName: methode,
        payload: payload,
        responseTimeoutInSeconds: 15
      };
      client.invokeDeviceMethod(targetDevice, methodParams, function (err, result) {
        if (err) {
          console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
        } else {
          console.log(methodParams.methodName + ' on ' + targetDevice + ':');
          console.log(JSON.stringify(result, null, 2));
        }
      });
  }
});