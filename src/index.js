const { selectAll } = require('unist-util-select');
const cheerio = require('cheerio');
const fs = require('fs-extra');

const assetsHost = require('./utils/assetsHost');
const hostEquals = require('./utils/hostEquals');
const replace = require('./utils/replace');

module.exports = async (
  { markdownAST, store },
  {
    apiToken,
    maxWidth = 650,
    tracedSVG = false,
    backgroundColor = 'transparent',
    wrapperStyle = '',
    showCaptions = false,
    linkImagesToOriginal = true,
    convertGifsToVideo = true,
  },
) => {
  const options = {
    maxWidth,
    tracedSVG,
    backgroundColor,
    wrapperStyle,
    showCaptions,
    linkImagesToOriginal,
    convertGifsToVideo,
  };
  const cacheDir = `${
    store.getState().program.directory
  }/.cache/datocms-assets`;

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  const imgixHost = await assetsHost.get(apiToken);

  const imageNodes = selectAll('image', markdownAST);
  const htmlNodes = selectAll('html', markdownAST);

  for (const node of imageNodes) {
    if (!hostEquals(node.url, imgixHost)) {
      return;
    }

    const rawHtml = await replace(node, cacheDir, options);

    node.type = `html`;
    node.value = rawHtml;
  }

  for (const node of htmlNodes) {
    if (!node.value) {
      return;
    }

    const $ = cheerio.load(node.value);

    const images = [];
    $('img').each(function () {
      const url = $(this).attr('src');

      if (!hostEquals(url, imgixHost)) {
        return;
      }

      images.push($(this));
    });

    for (const image of images) {
      const node = {
        url: image.attr('src'),
        title: image.attr('title'),
        alt: image.attr('alt'),
      };

      const rawHtml = await replace(node, cacheDir, options);
      image.replaceWith(rawHtml);
    }

    node.value = $(`body`).html();
  }
};
