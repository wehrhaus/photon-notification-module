'use strict';

const request                 = require('request');
const express                 = require('express');
const bodyParser              = require('body-parser');
const app                     = express();
const PORT                    = 3000 || process.env.PORT;
const { getDeviceIdentifier } = require('./lib/getDeviceIdentifier');

const DEVICE_ID    = getDeviceIdentifier('DEVICE_ID');
const ACCESS_TOKEN = getDeviceIdentifier('ACCESS_TOKEN');

const dataTransport = webhookData => {
  console.log(webhookData);
  request({
    url: `https://api.particle.io/v1/devices/${DEVICE_ID}/notification`,
    qs: { 'access_token': ACCESS_TOKEN },
    method: 'POST',
    body: webhookData,
    json: false
  }, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(res.body);
  });
};

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const body = req.body;
  
  const {
    action,
    sender
  } = body;
  const webhookData = `VCS_NOTIFICATION,${sender.login},${action}`;

  dataTransport(webhookData);
  res.set('Content-Type', 'text/html');
  res.send(`Webhook ${action} action received by ${sender.login}`);
});

app.listen(3000, err => {
  if (err) {
    throw err;
  }
  
  console.log(`Server started on port ${PORT}`);
});

process.on('uncaughtException', function (err) {
    throw err;
});
