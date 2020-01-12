const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'http://joyreactor.cc/all/45216';

async function getHtml(url) {
  const response = await axios.get(url);
  const html = response.data;
  return html;
}

function getUrls(html, selector, elementParser) {
  urls = [];
  const $ = cheerio.load(html);
  $(selector).each((i, element) => {
    const url = elementParser(element);
    urls.push(url);
  });
  return urls;
}

function downloadFiles(urls) {
  urls.forEach(async (url, i) => {
    const ext = path.parse(url).ext;

    const searchString = '/post/';
    const postIndex = url.indexOf(searchString);
    const firstHalf = url.slice(0, postIndex);
    const secondHalf = url.slice(postIndex + searchString.length);
    const fullUrl = `${firstHalf}/post/full/${secondHalf}`;

    try {
      const response = await axios({
        method: "get",
        url: fullUrl,
        responseType: "stream",
        headers: {
          Referer: url,
        }
      });
      response.data.pipe(fs.createWriteStream(`./downloads/${i}${ext}`));
    } catch(err) {
      console.log(err);
    }
  });
  
}

async function parse(url, selector, elementParser = element => element) {
  const html = await getHtml(url);
  const urls = getUrls(html, selector, elementParser);
  downloadFiles(urls);
}

parse(url, '.image img', (image) => {
  const url = image.attribs.src;
  return url;
});