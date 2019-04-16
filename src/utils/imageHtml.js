module.exports = ({ originalImage, title, alt, base64, resolvedImage: { width, src, srcSet, sizes, aspectRatio }, backgroundColor, wrapperStyle, linkImagesToOriginal }) => {
  const html = `
    <span
      class="gatsby-resp-image-wrapper"
      style="position: relative; display: block; max-width: ${width}px; margin-left: auto; margin-right: auto; ${wrapperStyle};"
    >
      <span
        class="gatsby-resp-image-background-image"
        style="padding-bottom: ${(1 / aspectRatio) * 100}%; position: relative; bottom: 0; left: 0; background-image: url('${base64}'); background-size: cover; display: block;"
      ></span>
      <img
        class="gatsby-resp-image-image"
        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px ${backgroundColor};"
        src="${src}"
        title="${title || ''}"
        alt="${alt || ''}"
        srcset="${srcSet}"
        sizes="${sizes}"
      />
    </span>
  `.trim();

  if (linkImagesToOriginal) {
    return `
      <a
        class="gatsby-resp-image-link"
        href="${originalImage.url}"
        style="display: block"
        target="_blank"
        rel="noopener"
      >
        ${html}
      </a>
    `;
  }

  return html;
};
