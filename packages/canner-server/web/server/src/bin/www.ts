import {createApp} from '../app';
import * as logger from '../logger';
const port = process.env.NODE_PORT || 3000;

createApp().then(({app, server, config}) => {
  app.listen(port, () => {
    if (config.env === 'production') {
      logger.info({
        component: logger.components.system,
        type: 'START_SERVER',
        port,
        graphqlPath: server.graphqlPath
      });
      return;
    }
    // tslint:disable-next-line:no-console
    console.log(`
      🚀 Server ready on port ${port}
      graphql at http://localhost:${port}${server.graphqlPath}
    `);
  });
})
.catch(err => {
  logger.error({
    component: logger.components.system,
    type: 'FAIL_START_SERVER',
    message: err.message,
    stack: err.stack
  });
});