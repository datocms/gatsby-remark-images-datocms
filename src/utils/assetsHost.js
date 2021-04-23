const { SiteClient } = require('datocms-client');

module.exports = {
  value: null,
  async get(apiToken) {
    if (this.value) {
      return this.value;
    }

    const client = new SiteClient(apiToken);
    const { imgixHost } = await client.site.find();

    this.value = imgixHost;

    return imgixHost;
  },
};
