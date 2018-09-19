// @flow

import * as React from 'react';
import {generateAction} from '../action';
import {createEmptyData} from 'canner-helpers';
import RefId from 'canner-ref-id';
import type {HOCProps} from './types';
import {update, merge, isArray, isPlainObject, mapValues} from 'lodash';

type changeQueue = Array<{RefId: RefId | {firstRefId: RefId, secondRefId: RefId}, type: any, value: any}>;

export default function withRequest(Com: React.ComponentType<*>) {
  // this hoc will update data;
  return class ComponentWithRequest extends React.Component<HOCProps> {
    onChange = (refId: RefId | {firstRefId: RefId, secondRefId: RefId} | changeQueue, type: any, delta: any, config: any): Promise<*> => {
      let id;
      if (isArray(refId)) { // changeQueue
        const changeQueue = refId;
        // $FlowFixMe
        return Promise.all(changeQueue.map(args => {
          const {refId, type, value} = args;
          return this.onChange(refId, type, value);
        }));
      } else if (refId instanceof RefId) {
        id = refId.toString();
      } else {
        id = {
          // $FlowFixMe: refId should be object here
          firstId: refId.firstRefId.toString(),
          // $FlowFixMe: refId should be object here
          secondId: refId.secondRefId.toString()
        };
      } 
      const {schema, rootValue, request} = this.props;
      const itemSchema = findSchemaByRefId(schema, refId);
      const {relation, items, pattern} = itemSchema;
      const action = createAction({
        relation,
        id,
        type,
        value: delta,
        config,
        rootValue,
        items,
        pattern
      });
      if (!action) {
        throw new Error('invalid change');
      }
      if (action.type === 'NOOP') {
        return Promise.resolve();
      }
      // $FlowFixMe
      return request(action);
    }

    render() {
      return <Com {...this.props} onChange={this.onChange} />;
    }
  };
}

export function createAction({
  relation,
  id,
  type,
  value,
  config,
  rootValue,
  items,
}: { 
  relation: any,
  id: {firstId: string, secondId: string} | string,
  type: 'create' | 'update' | 'delete' | 'swap',
  value: any,
  config: any,
  rootValue: any,
  value: any,
  items: any
}) {
  if (type === 'create') {
    if (!config) {
      const emptyData = createEmptyData(items);
      if (isPlainObject(emptyData)) {
        value = merge(emptyData, value);
      } else {
        value = emptyData;
      }
    }
    if (typeof id === 'string' && id.split('/').length === 1) {
      update(value, 'id', id => id || randomId());
    }
  }
  value = addTypename(value)
  return generateAction({
    id,
    updateType: type,
    value,
    rootValue,
    relation
  });
}

function randomId() {
  return Math.random().toString(36).substr(2, 12);
}

function addTypename(value) {
  if (isPlainObject(value)) {
    update(value, '__typename', typename => typename || null);
    value = mapValues(value, child => addTypename(child));
  } else if (isArray(value)) {
    value = value.map(child => addTypename(child));
  }
  return value;
}

export function findSchemaByRefId(schema: Object, refId: any) {
  let paths = [];
  if (isPlainObject(refId)) {
    paths = refId.firstRefId.getPathArr();
  } else {
    paths = refId.getPathArr();
  }
  let pattern = '';
  return loop(schema, paths, pattern);
}

export function loop(schema: Object, paths: Array<string>, pattern: string): any {
  if (paths.length === 0) {
    return {
      ...schema,
      pattern: removeFirstSlash(pattern)
    };
  }

  if (!schema.type) { // in items of object
    return loop(schema[paths[0]], paths.slice(1), `${pattern}/${schema[paths[0]].type}`);
  }

  if (schema.type === 'json') {
    return {};
  }

  if (schema.type === 'array') {
    if (paths.length === 1) {
      // paths = [index], so just return
      return loop(schema, [], pattern);
    } else if (schema.items.type === 'object') {
      // path[0] is index, so we take the paths[1]
      return loop(schema.items.items[paths[1]], paths.slice(2), `${pattern}/${schema.items.items[paths[1]].type}`);
    }
  }
  return loop(schema.items[paths[0]], paths.slice(1), `${pattern}/${schema.items[paths[0]].type}`);
}

function removeFirstSlash(pattern: string) {
  return pattern.split('/').slice(1).join('/');
}