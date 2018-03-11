'use strict';

const request                 = require('request');
const express                 = require('express');
const bodyParser              = require('body-parser');
const app                     = express();

const {
  server_settings,
  device_settings
} = require('./config');

const dataTransport = webhookData => {
  request({
    url: `https://api.particle.io/v1/devices/${device_settings.device_id}/notification`,
    qs: { 'access_token': device_settings.access_token },
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

app.listen(server_settings.port, err => {
  if (err) {
    throw err;
  }
  
  console.log(`Server started on port ${server_settings.port}`);
});

process.on('uncaughtException', function (err) {
    throw err;
});
