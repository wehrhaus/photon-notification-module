const fs                      = require('fs');
const path                    = require('path');
const {
  version,
  build_number
}                             = JSON.parse(fs.readFileSync(path.normalize(`${__dirname}/../../package.json`), { encoding: 'utf8'}));
const { getDeviceIdentifier } = require('../func/getDeviceIdentifier');

const server_settings = {
  port: process.env.PORT || 3000,
  version,
  build_number
};

const device_settings = {
  device_id: getDeviceIdentifier('DEVICE_ID'),
  access_token: getDeviceIdentifier('ACCESS_TOKEN')
};

module.exports = {
  server_settings,
  device_settings
};
