const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = function downloadFiles(queries) {
  queries.forEach(async (query, i) => {
    const fileName = decodeURI(path.parse(query.url).base);

    try {
      const response = await axios(query);
      response.data.pipe(fs.createWriteStream(`./downloads/${fileName}`));
    } catch(err) {
      console.log(`REQUEST ERROR: ${err.message}`);
    }
  });
}
