/**
 * @flow
 */

import Action from './action';
import {Map, fromJS} from 'immutable';
import type Endpoint from '../endpoint';

type mapDataType = Map<any, any>

type mutaionArgs = {
  mapData: mapDataType,
  path: Array<string>,
  data: any
}

type actionArgs = {
  name: string,
  path: Array<string>,
  data: any,
  mutation: any => mapDataType,
  mapData: mapDataType,
  endpoint: Endpoint
}

export default class MapUpdate extends Action {
  name: string
  path: Array<string>
  data: any
  mutation: (mapDataType) => mapDataType
  cachedData: mapDataType
  endpoint: Endpoint

  constructor({name, path, data, mutation, mapData, endpoint}: actionArgs) {
    super();
    this.name = name;
    this.path = path;
    this.data = data;
    this.mutation = mutation;
    this.endpoint = endpoint;
    // data could be any type, so we need to initialize data
    // so in apicall we could serve with this data
    // making PUT /headers, data
    // api request MUST be top level, just make it easier for now
    this.cachedData = mapData;
  }

  getUpdateMutation() {
    return (this.mutation) ?
      this.mutation :
      this.defaultUpdateMutation;
  }

  defaultUpdateMutation({mapData, path, data}: mutaionArgs): mapDataType {
    const immutableData: any = fromJS(data);
    // if map, merged with data
    // otherwise, (string, number, ...) setIn
    return (Map.isMap(immutableData)) ?
      mapData.mergeIn(path, immutableData) :
      // $FlowFixMe: immutable flow problem
      mapData.setIn(path, immutableData);
  }

  callApi() {
    return this.endpoint.updateObject(this.name, this.cachedData.toJS());
  }

  mutate(mapData: mapDataType) {
    const mutation = this.getUpdateMutation();
    // $FlowFixMe
    mapData = mutation({
      mapData: mapData,
      path: this.path,
      data: this.data
    });
    this.cachedData = mapData;
    return mapData;
  }
}
