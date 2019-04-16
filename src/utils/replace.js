const qs = require('query-string');

const fluidResolver = require('gatsby-source-datocms/hooks/setFieldsOnGraphQLNodeType/nodes/upload/fluidResolver');
const getBase64 = require('gatsby-source-datocms/hooks/setFieldsOnGraphQLNodeType/nodes/upload/utils/getBase64');
const getTracedSVG = require('gatsby-source-datocms/hooks/setFieldsOnGraphQLNodeType/nodes/upload/utils/getTracedSVG');

const getMetadata = require('./getMetadata');
const imageHtml = require('./imageHtml');
const videoHtml = require('./videoHtml');

module.exports = async function replace(node, cacheDir, options) {
  const { resolve } = fluidResolver(cacheDir);
  const { maxWidth, tracedSVG, convertGifsToVideo, showCaptions } = options;

  const imgixParams = qs.parse(node.url);

  const {
    PixelHeight: height,
    PixelWidth: width,
    'Content-Type': contentType
  } = await getMetadata(node.url, cacheDir);

  const format = contentType.replace(/^image\//, '');

  const image = {
    url: node.url.split(/[?#]/)[0],
    width,
    height,
    format,
  };

  const resolvedImage = resolve(image, { maxWidth, imgixParams });
  const base64 = tracedSVG ?
    await getTracedSVG(resolvedImage, cacheDir) :
    await getBase64(resolvedImage, cacheDir);

  const htmlOptions = Object.assign(
    { title: node.title, alt: node.alt },
    { originalImage: image, base64, resolvedImage },
    options
  );

  const html = format === 'gif' && convertGifsToVideo ?
    videoHtml(htmlOptions) : imageHtml(htmlOptions);

  if (!showCaptions || !node.title) {
    return html;
  }

  return `
    <figure class="gatsby-resp-image-figure">
      ${html}
      <figcaption class="gatsby-resp-image-figcaption">${node.title}</figcaption>
    </figure>
  `;
}
