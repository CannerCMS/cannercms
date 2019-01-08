import { createApp } from '../app';

createApp()
  .then(({ app }) => {
    return app.listen();
  })
  .then(({ url }) => {
    // tslint:disable-next-line:no-console
    console.log(`🚀 GQLify server ready at ${url}`);
  })
  .catch(err => {
    console.log(err);
  });