/**
 * @flow
 */

export default class Action {
  name: string

  callApi(): Promise.resolve<any> {
    return Promise.resolve();
  }

  mutate(data: MapType<any, any>) {
    return data;
  }

  mergeAfterApiCall(data: MapType<any, any>) {
    return data;
  }

  getName() {
    return this.name;
  }
}
