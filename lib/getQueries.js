const cheerio = require('cheerio');

const hosts = [
  {
    host: "joyreactor",
    mirrors: [
      "joyreactor.com", 
      "joyreactor.cc", 
      "joyreactor.ru", 
      "fapreactor.com", 
      "pornreactor.cc"
    ],
    typeHandlers: {
      image: joyreactorImage,
      video: ($) => {},
    }
  },
];

function joyreactorImage($) {
  const srcs = [];
  const selector = ".image img";

  $(selector).each((i, img) => {
    let originalSrc = img.attribs.src;
    const queryUrl = originalSrc.replace("/post/", "/post/full/");
    srcs.push({
      url: queryUrl,
      method: "get",
      responseType: "stream",
      headers: {
        Referer: originalSrc,
      },
    });
  });

  return srcs;
}

module.exports = function getSrcs(html, hostname, types) {
  const host = hosts.find(hostItem => {
    return hostItem.mirrors.includes(hostname);
  });

  if (!host) throw new Error("No such host in dictionary. Contact to developer.");

  let queries = [];
  const $ = cheerio.load(html);

  types.forEach(type => {
    queries = [...queries, ...host.typeHandlers[type]($)];
  });

  return queries;
};