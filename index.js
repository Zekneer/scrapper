const axios = require('axios');
const cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');

const url = 'http://joyreactor.cc/post/4209094';

function getData(html) {
  data = [];
  const $ = cheerio.load(html);
  $('.image img').each((i, image) => {
    image.attribs.src.replace('cc', 'com');
    data.push(image.attribs.src);
  });
  data.forEach((url, i) => {
    var file = fs.createWriteStream(i + ".jpg");
    var request = http.get(url, function(response) {
      response.headers
      response.pipe(file);
    });
  });

  return data;
}

async function getSite(url) {
  const response = await axios.get(url);
  const data = getData(response.data);
  console.log(data);
}

getSite(url);