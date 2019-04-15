const { selectAll } = require('unist-util-select');
const cheerio = require('cheerio');
const { SiteClient } = require('datocms-client');
const { URL } = require('url');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const fluidResolver = require('gatsby-source-datocms/hooks/setFieldsOnGraphQLNodeType/nodes/upload/fluidResolver');
const getBase64 = require('gatsby-source-datocms/hooks/setFieldsOnGraphQLNodeType/nodes/upload/utils/getBase64');

const assetsHost = {
  value: null,
  async get(apiToken) {
    if (this.value) {
      return this.value;
    }

    const client = new SiteClient(apiToken);
    const { imgixHost } = await client.site.find();

    this.value = imgixHost;

    return imgixHost;
  }
};

const hasHost = (src, host) => {
  let url;

  try {
    url = new URL(src);
  } catch(e) {
    return false;
  }

  return url.host === host;
}

const fetchMetadata = async (src) => {
  const url = new URL(src);
  url.search = 'fm=json';

  const res = await fetch(url.href);

  if (res.status === 200) {
    return res.json();
  }

  console.log('ERROR', src, url.href);

  throw res.status;
}

const replace = async (url, cacheDir) => {
  const { resolve } = fluidResolver(cacheDir);

  const {
    PixelHeight: height,
    PixelWidth: width,
    'Content-Type': contentType
  } = await fetchMetadata(url);

  const image = {
    url,
    width,
    height,
    format: contentType.replace(/^image\//, ''),
  };

  const resolvedImage = resolve(image, { maxWidth: 800 });
  const base64 = await getBase64(resolvedImage, cacheDir);

  const rawHtml = `
    <span
      class="gatsby-resp-image-wrapper"
      style="position: relative; display: block; max-width: ${resolvedImage.width}px; margin-left: auto; margin-right: auto;"
    >
      <span
        class="gatsby-resp-image-background-image"
        style="padding-bottom: ${(1 / resolvedImage.aspectRatio) * 100}%; position: relative; bottom: 0; left: 0; background-image: url('${base64}'); background-size: cover; display: block;"
      ></span>
      <img
        class="gatsby-resp-image-image"
        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px;"
        src="${resolvedImage.src}"
        srcset="${resolvedImage.srcSet}"
        sizes="${resolvedImage.sizes}"
      />
    </span>
  `.trim();

  return rawHtml;
}

module.exports = async (
  { markdownAST, store },
  { apiToken }
) => {
  const cacheDir = `${store.getState().program.directory}/.cache/datocms-assets`;

  if (!fs.existsSync(cacheDir)){
    fs.mkdirSync(cacheDir);
  }

  const imgixHost = await assetsHost.get(apiToken);

  const imageNodes = selectAll('image', markdownAST);
  const htmlNodes = selectAll('html', markdownAST)

  for (const node of imageNodes) {
    const { url } = node;

    if (!hasHost(url, imgixHost)) {
      return;
    }

    const rawHtml = await replace(url, cacheDir);

    node.type = `html`;
    node.value = rawHtml;
  }

  for (const node of htmlNodes) {
    if (!node.value) {
      return;
    }

    const $ = cheerio.load(node.value);

    const images = []
    $('img').each(function() {
      const url = $(this).attr('src');

      if (!hasHost(url, imgixHost)) {
        return;
      }

      images.push($(this));
    });

    for (const image of images) {
      const rawHtml = await replace(image.attr('src'), cacheDir);
      image.replaceWith(rawHtml);
    }

    node.value = $(`body`).html();
  }
}
