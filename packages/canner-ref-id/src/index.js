// @flow

export default class CannerRefId {
  _internalArr: Array<string>

  constructor(initString: string) {
    this._internalArr = initString ? initString.split('/') : [];
  }

  getPathArr = (): Array<string> => {
    return this._internalArr;
  }

  toString = () => {
    return this._internalArr.join("/");
  }

  child = (route: string) => {
    const newRoute = (this._internalArr && this._internalArr.length) ?
      this._internalArr.join("/").concat("/", route):
      route;
    return new CannerRefId(newRoute);
  }

  remove = (count: number = 1) => {
    const newRoute = this._internalArr.slice(0, -count).join("/");
    return new CannerRefId(newRoute);
  }
}
