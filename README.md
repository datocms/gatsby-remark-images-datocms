<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

![Node.js CI](https://github.com/datocms/gatsby-remark-images-datocms/workflows/Node.js%20CI/badge.svg)

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

`npm install --save gatsby-remark-images-datocms`

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

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agencies, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Why DatoCMS?**

- **API-First Architecture**: Built for both REST and GraphQL, enabling flexible content delivery
- **Just Enough Features**: We believe in keeping things simple, and giving you [the right feature-set tools](https://www.datocms.com/features) to get the job done
- **Developer Experience**: First-class TypeScript support with powerful developer tools

**Getting Started:**

- ⚡️ [Create Free Account](https://dashboard.datocms.com/signup) - Get started with DatoCMS in minutes
- 🔖 [Documentation](https://www.datocms.com/docs) - Comprehensive guides and API references
- ⚙️ [Community Support](https://community.datocms.com/) - Get help from our team and community
- 🆕 [Changelog](https://www.datocms.com/product-updates) - Latest features and improvements

**Official Libraries:**

- [**Content Delivery Client**](https://github.com/datocms/cda-client) - TypeScript GraphQL client for content fetching
- [**REST API Clients**](https://github.com/datocms/js-rest-api-clients) - Node.js/Browser clients for content management
- [**CLI Tools**](https://github.com/datocms/cli) - Command-line utilities for schema migrations (includes [Contentful](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [WordPress](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress) importers)

**Official Framework Integrations**

Helpers to manage SEO, images, video and Structured Text coming from your DatoCMS projects:

- [**React Components**](https://github.com/datocms/react-datocms)
- [**Vue Components**](https://github.com/datocms/vue-datocms)
- [**Svelte Components**](https://github.com/datocms/datocms-svelte)
- [**Astro Components**](https://github.com/datocms/astro-datocms)

**Additional Resources:**

- [**Plugin Examples**](https://github.com/datocms/plugins) - Example plugins we've made that extend the editor/admin dashboard
- [**Starter Projects**](https://www.datocms.com/marketplace/starters) - Example website implementations for popular frameworks
- [**All Public Repositories**](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->
