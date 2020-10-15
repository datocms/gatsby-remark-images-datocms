const { URL } = require('url');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const md5 = require('md5');

module.exports = async function getMetadata(src, cacheDir) {
  const url = new URL(src);
  url.search = 'fm=json';

  const cacheFile = path.join(cacheDir, md5(url));

  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  const res = await fetch(url.href);

  if (res.status === 200) {
    const metadata = await res.json();
    fs.writeFileSync(cacheFile, JSON.stringify(metadata), 'utf8');
    return metadata;
  }

  console.log('ERROR', src, url.href);

  throw res.status;
};
