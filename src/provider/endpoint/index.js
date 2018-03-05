import objectId from 'bson-objectid';

/**
 * @flow
 */

export default class Endpoint {
  constructor() {
    (this: any).getArray = this.getArray.bind(this);
    (this: any).createArray = this.createArray.bind(this);
    (this: any).updateArray = this.updateArray.bind(this);
    (this: any).deleteArray = this.deleteArray.bind(this);
    (this: any).getObject = this.getObject.bind(this);
    (this: any).updateObject = this.updateObject.bind(this);
  }

  prepare(): Promise<any> {
    // after your preprocess, return promise
    return Promise.resolve();
  }

  generateUniqueId(): string {
    return objectId().toString();
  }

  getArray(key: string, conditions?: ?queryType): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define getArray method');
  }

  createArray(key: string, data: {[string]: any}): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define createArray method');
  }

  updateArray(key: string, id: string, data: {[string]: any}): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define updateArray method');
  }

  deleteArray(key: string, id: string): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define deleteArray method');
  }

  getObject(key: string): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define getObject method');
  }

  updateObject(key: string, data: {[string]: any}): Promise<any> { // eslint-disable-line no-unused-vars
    throw new Error('You need to define updateObject method');
  }
}
