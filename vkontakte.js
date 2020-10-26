const path = require('path');
const easyvk = require('easyvk');

async function startVK() {
  const response = await easyvk({
    username: process.env.VK_LOGIN,
    password: process.env.VK_PASS,
    sessionFile: path.join(__dirname, '.my-session'),
  });
  return response;
}

module.exports = startVK;
