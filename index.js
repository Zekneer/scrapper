// Functions
const scappUrl = require("./lib/scappUrl");

try {
  const initialUrl = process.argv[2];
  const hostname = new URL(initialUrl).hostname;
  const initialAmount = Number(process.argv[3]) || 1;
  const types = process.argv[4] ? process.argv.slice(4) : ["image"];

  (async () => {
    try {
      let url = initialUrl;
      let amount = initialAmount;
      
      while (amount >= 1) {
        await scappUrl(url, hostname, types);
        console.log(`Page ${amount} scrapped!`);
        url = url.replace(/\d+$/, (numbers) => numbers - 1);
        if (url === initialUrl) {
          amount = 0;
        } else {
          amount--;
        }
      }
    } catch(err) {
      console.log(`MAIN FUNCTION ERROR: ${err.message}`);
    }
  })();

} catch(err) {
  console.log(`PARAMETERS ERROR: ${err.message}`);
}
