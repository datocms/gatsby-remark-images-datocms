const { URL } = require('url');

module.exports = function hostEquals(src, host) {
  let url;

  try {
    url = new URL(src);
  } catch (e) {
    return false;
  }

  return url.host === host;
};
