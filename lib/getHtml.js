const axios = require('axios');

module.exports = async function getHtml(url) {
  const response = await axios.get(url);
  return response.data;
}
