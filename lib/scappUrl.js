const getHtml = require("./getHtml");
const getQueries = require("./getQueries");
const downloadFiles = require("./downloadFiles");

module.exports = async function scappUrl(url, hostname, types) {
  const html = await getHtml(url);
  const queries = getQueries(html, hostname, types);
  await downloadFiles(queries);
}
