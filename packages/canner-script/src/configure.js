// @flow

import VisitorManager from './visitorManager';

class Configuration {
  configure = (config: Object) => {
    const {visitorManager} = config;
    if (!visitorManager) {
      throw new Error(`Configure in canner-script must have the following key: visitorManager, but receive ${JSON.stringify(config)}`)
    }

    if (visitorManager) {
      const {defaultVisitors, visitors} = visitorManager;

      if (defaultVisitors) {
        VisitorManager.setDefaultVisitors(defaultVisitors);
      }

      if (visitors && visitors.length) {
        visitors.forEach(visitor => {
          VisitorManager.addVisitor(visitor);
        });
      }

      if (visitors && !visitors.length) {
        VisitorManager.resetVisitors();
      }
    }
  }
}

export default new Configuration();
