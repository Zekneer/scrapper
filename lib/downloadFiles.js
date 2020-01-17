const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sanitize = require("sanitize-filename");
const getFileId = require("./getFileId");

module.exports = async function downloadFiles(queries) {
  const downloadPromises = queries.map(async query => {
    const fileName = getFileId() + sanitize(decodeURI(path.parse(query.url).base));
    const ext = path.parse(query.url).ext.replace('.', '');

    try {
      const response = await axios(query);
      const pathToDir = `./downloads/${ext}/`;
      const pathToFile = `${pathToDir}${fileName}`;
      
      if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir);
      }

      if (fs.existsSync(pathToFile)) return Promise.resolve(true);

      return new Promise(resolve => {
        response.data.pipe(fs.createWriteStream(pathToFile)).on('finish', resolve);
      });
      
    } catch(err) {
      console.log(`DOWNLOAD REQUEST ERROR: ${err.message}`);
    }

    return Promise.resolve(true);
  });

  await Promise.all(downloadPromises);
}
