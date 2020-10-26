const axios = require('axios');

function sendMessage(text) {
  const token = process.env.TG_BOT_TOKEN;
  const group = process.env.TG_GROUP_ID;
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${group}&text=${text}`;
  return axios.get(url);
}

module.exports = { sendMessage };
