import { createApp } from '../app';
import { MemoryDataSource } from '@gqlify/server';
const port = process.env.NODE_PORT || 3000;

createApp({
  dataSources: {
    memory: () => new MemoryDataSource(),
  }
}).then(app => {
  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`
      start server
    `);
  });
})
.catch(console.error);
