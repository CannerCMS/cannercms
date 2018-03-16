// @flow
import {Map, List} from 'immutable';

export function findAndReplaceField(data: Map<string, any> | List<any>, path: Array<string>, replace: {from: string, to: string}): Map<string, any> | List<any> {
  // $FlowFixMe
  if (List.isList(data) && Map.isMap(data.get(0))) {
    data = data.map((datum) => {
      return findAndReplaceField(datum, path, replace);
    });
  } else if (path.length === 1) {
    // find the field!
    data = replaceField(((data: any): Map<string, any>), path[0], replace);
  } else {
    const nextPath = path.slice(1);
  // $FlowFixMe
    data = data.set(path[0], findAndReplaceField((data: any).get(path[0]), nextPath, replace));
  }
  return data;
}

export function replaceField(value: Map<string, any>, field: string, replace: {from: string, to: string}): Map<string, any> {
  let fieldValue = value.get(field);
  if (List.isList(fieldValue)) {
    fieldValue = (fieldValue: any).map((value) => {
      if (value === replace.from) {
        value = replace.to;
      }
      return value;
    });
  } else if (fieldValue === replace.from) {
    fieldValue = replace.to;
  }
  return value.set(field, fieldValue);
}
