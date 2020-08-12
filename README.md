# gatsby-remark-images-datocms

Processes images in markdown so they can be used in the production build using DatoCMS's built-in CDN.

In the processing, it makes images responsive by:

- Adding an elastic container to hold the size of the image while it loads to
  avoid layout jumps.
- Generating multiple versions of images at different widths and sets the
  `srcset` and `sizes` of the `img` element so regardless of the width of the
  device, the correct image is downloaded.
- Converting GIF images into `video` elements.
- Using the "blur up" technique popularized by [Medium][1] and [Facebook][2]
  where a small 20px wide version of the image is shown as a placeholder until
  the actual image is downloaded.

## Install

`npm install --save gatsby-remark-images-datocms gatsby-transformer-remark gatsby-plugin-sharp`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images-datocms`,
          options: {
            // You need to specify your project read-only API token here!
            apiToken: 'XXXXX',
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 590,
          },
        },
      ],
    },
  },
]
```
An example of displaying markdown in a blog component. Where a single `post` has a `content` field.
```JSX
export default ({ data }) => {
  const post = data.datoCmsBlog;
  return (
      <div>
        {/* Before */}
        {/* <div dangerouslySetInnerHTML={{ __html: post.content }}  /> */}

         {/* After */}
        <div dangerouslySetInnerHTML={{ __html: post.contentNode.childMarkdownRemark.html }} />
      </div>
  );
};

export const query = graphql`
query($slug: String!) {
    datoCmsBlog(slug: { eq: $slug }) {
    //  Before
      content
    // After
      contentNode {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;
```
-----
## Options

| Name                   | Default       | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxWidth`             | `650`         | The `maxWidth` in pixels of the `div` where the markdown will be displayed. This value is used when deciding what the width of the various responsive thumbnails should be.                                                                                                                                                                                                                                                              |
| `linkImagesToOriginal` | `true`        | Add a link to each image to the original image. Sometimes people want to see a full-sized version of an image e.g. to see extra detail on a part of the image and this is a convenient and common pattern for enabling this. Set this option to false to disable this behavior.                                                                                                                                                          |
| `showCaptions`         | `false`       | Add a caption to each image with the contents of the title attribute, when this is not empty. Set this option to true to enable this behavior.                                                                                                                                                                                                                                                                                           |
| `wrapperStyle`         |               | Add custom styles to the div wrapping the responsive images. Use regular CSS syntax, e.g. `margin-bottom:10px; background: red;`                                                                                                                                                                                                                                                                                                         |
| `backgroundColor`      | `transparent` | Set the background color of the image to match the background of your design                                                                                                                                                                                                                                                                                                                                                             |
| `convertGifsToVideo`   | `true`        | Convert GIF images into `video` elements

[1]: https://jmperezperez.com/medium-image-progressive-loading-placeholder/
[2]: https://code.facebook.com/posts/991252547593574/the-technology-behind-preview-photos/
