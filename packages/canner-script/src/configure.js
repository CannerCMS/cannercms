// @flow

import Validator from './validator';
import VisitorManager from './visitorManager';

class Configuration {
  configure = (config: Object) => {
    const {validator, visitorManager} = config;
    if (!validator && !visitorManager) {
      throw new Error(`Configure in canner-script must have the following key: validator, visitorManager, but receive ${JSON.stringify(config)}`)
    }

    if (validator) {
      Validator.setConfig(validator);
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
