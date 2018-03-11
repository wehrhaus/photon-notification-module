const getDeviceIdentifier = type => {
  if (!process.env[type]) {
    throw new Error(`Missing required device identifier: ${type}`);
  }
  return process.env[type];
};

module.exports.getDeviceIdentifier = getDeviceIdentifier;
