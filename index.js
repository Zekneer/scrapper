// Functions
const getHtml = require("./lib/getHtml");
const getQueries = require("./lib/getQueries");
const downloadFiles = require("./lib/downloadFiles");

try {
  // Get process parameters
  const url = process.argv[2];
  const hostname = new URL(url).hostname;
  const amount = Number(process.argv[3]) || 1;
  const types = process.argv[4] ? process.argv.slice(4) : ["image"];

  (async () => {
    try {
      const html = await getHtml(url);
      const queries = getQueries(html, hostname, types);
      await downloadFiles(queries);
    } catch(err) {
      console.log(`MAIN FUNCTION ERROR: ${err.message}`);
    }
  })();

} catch(err) {
  console.log(`PARAMETERS ERROR: ${err.message}`);
}
