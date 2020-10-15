const { suite } = require('uvu');
const buildQueryExecutor = require('./support/buildQueryExecutor');
const assertGraphQLResponseEqualToSnapshot = require('./support/assertGraphQLResponseEqualToSnapshot');

const GraphQL = suite('GraphQL');

let executeQuery;

GraphQL.before(async () => {
  executeQuery = await buildQueryExecutor('bb260a9bf12cccf24392dc68209a42');
});

GraphQL('remark', async () => {
  const result = await executeQuery(`
    {
      enArticle: datoCmsArticle(originalId: {eq: "7364344"}, locale: {eq: "en"}) {
        multipleParagraphTextNode {
          id
          internal {
            content
          }
          childMarkdownRemark {
            html
            timeToRead
          }
        }
      }
    }`);

  assertGraphQLResponseEqualToSnapshot('remark', result);
});

GraphQL.run();
