module.exports = ({
  originalImage: { url },
  maxWidth,
  base64,
  resolvedImage: { aspectRatio },
  wrapperStyle,
}) =>
  `
    <span
      class="gatsby-resp-video-wrapper"
      style="position: relative; display: block; max-width: ${maxWidth}px; margin-left: auto; margin-right: auto; ${wrapperStyle};"
    >
      <span
        class="gatsby-resp-video-background-image"
        style="padding-bottom: ${
          (1 / aspectRatio) * 100
        }%; position: relative; bottom: 0; left: 0; background-image: url('${base64}'); background-size: cover; display: block;"
      ></span>
      <video
        class="gatsby-resp-video-video"
        loop
        autoplay
        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px;"
      >
        <source src="${url}?fm=webm&fit=max&w=${maxWidth}" type="video/webm" />
        <source src="${url}?fm=mp4&fit=max&w=${maxWidth}" type="video/mp4" />
      </video>
    </span>
  `.trim();
