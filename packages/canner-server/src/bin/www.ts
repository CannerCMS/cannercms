import { createApp } from '../app';
import { MemoryDataSource } from '@gqlify/server';
const port = process.env.NODE_PORT || 3000;

createApp({
  common: {
    hostname: 'http://localhost:3000',
  },
  cms: {
    oidc: null,
  },
  graphql: {
    dataSources: {
      memory: () => new MemoryDataSource(),
    },
  },
  auth: null,
}).then(app => {
  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`
      start server
    `);
  });
})
// tslint:disable-next-line:no-console
.catch(console.error);
