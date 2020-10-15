const qs = require('query-string');

const buildFluidFields = require('gatsby-source-datocms/hooks/sourceNodes/createTypes/utils/buildFluidFields');
const getBase64 = require('gatsby-source-datocms/hooks/sourceNodes/createTypes/utils/getBase64');
const getTracedSVG = require('gatsby-source-datocms/hooks/sourceNodes/createTypes/utils/getTracedSVG');

const getMetadata = require('./getMetadata');
const imageHtml = require('./imageHtml');
const videoHtml = require('./videoHtml');

const { resolve } = buildFluidFields().fluid;

module.exports = async function replace(node, cacheDir, options) {
  const { maxWidth, tracedSVG, convertGifsToVideo, showCaptions } = options;

  const imgixParams = qs.parse(node.url.split('?')[1]);

  const {
    PixelHeight: height,
    PixelWidth: width,
    'Content-Type': contentType,
  } = await getMetadata(node.url, cacheDir);

  const format = contentType.replace(/^image\//, '');

  const image = {
    entityPayload: {
      attributes: {
        url: node.url.split(/[?#]/)[0],
        width,
        height,
        format,
      },
    },
  };

  const resolvedImage = resolve(image, { maxWidth, imgixParams });
  const base64 = tracedSVG
    ? await getTracedSVG(resolvedImage, cacheDir)
    : await getBase64(resolvedImage, cacheDir);

  const htmlOptions = Object.assign(
    { title: node.title, alt: node.alt },
    { originalImage: image, base64, resolvedImage },
    options,
  );

  const html =
    format === 'gif' && convertGifsToVideo
      ? videoHtml(htmlOptions)
      : imageHtml(htmlOptions);

  if (!showCaptions || !node.title) {
    return html;
  }

  return `
    <figure class="gatsby-resp-image-figure">
      ${html}
      <figcaption class="gatsby-resp-image-figcaption">${node.title}</figcaption>
    </figure>
  `;
};
