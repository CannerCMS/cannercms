// @flow
import type {Middleware} from '../middleware';
import {List, Map} from 'immutable';
import {mutate} from '../../actions';
import {UNIQUE_ID} from '../../config';
import Entity from './entity';
import Resource from './resource';
import Filter from './filter';
import set from 'lodash/set';
import get from 'lodash/get';

// ObservableStore store the latest value with Rx.subject
// component subscibes the subject
// so if data changes then the observer will be executed

export default class ObservableStore implements Middleware {
  entity: Entity
  // store the collection data
  resource: Resource

  filter: Filter

  constructor() {
    this.entity = new Entity();
    this.resource = new Resource();
    this.filter = new Filter();
  }

  handleChange = (ctx: ContextType, next: NextType) => {
    const {request} = ctx;
    const {
      key,
    } = request;
    switch (request.type) {
      case 'write': {
        const {action} = request;
        if (this.resource.has(key)) {
          const mutatedValue = this.mutate(action);
          // $FlowFixMe
          action.payload.mutatedValue = mutatedValue;
          request.action = action;
          ctx.request = request;
        }
        return next();
      }
      case 'reset':
      case 'fetch': {
        const {componentId, query} = request;
        return next().then(() => {
          const {body} = ctx.response;
          if (this.resource.has(key)) {
            this.update(key, componentId, body, query && (query: any).filter, ctx);
            this.pushSubject(componentId, 'value', body);
          } else {
            this.create(key, componentId, body, query && (query: any).filter);
          }
        });
      }
      case 'subscribe': {
        const {
          observer,
          componentId,
          subjectType,
        } = request;
        set(ctx, 'response.subscription', this.subscribe(key, componentId, subjectType, observer));
        // variants need below but has problem
        // ctx.request.observer = value => {
        //   if (List.isList(value)) {
        //     this.resource.mergeList(key, value);
        //   } else {
        //     this.resource.merge(key, value);
        //   }
        //   this.entity.push(key, subjectType, value);
        // };
        // return next();
        break;
      }
      case 'deploy': {
        return next().then(() => {
          const replace = get(ctx, 'response.replace');
          if (replace) {
            this.replace(replace.slice());
          }
        });
      }
      default:
        break;
    }
  }

  replace = (replace: $PropertyType<$PropertyType<ContextType, 'response'>, 'replace'>) => {
    (replace || []).forEach((re) => {
      const key = re.path.split('/')[0];
      this.resource.replace(re, this.filter.hasKey(key));
      this.entity.replace(re, this.filter.getEntities(key));
      this.filter.getEntities(key).forEach((componentId) => {
        const ids = this.entity.get(componentId).ids;
        const collection = this.resource.getList(key, ids);
        this.entity.push(componentId, 'value', collection);
      });
    });
  }

  create = (key: string, componentId: string, value: Map<string, any> | List<any>, query: {[string]: any}) => {
    if (List.isList(value)) {
      this.filter.create(key, query, componentId);
      const ids = value.map((item) => item.get(UNIQUE_ID));
      this.entity.createCollection(componentId, (ids: any));
      this.resource.setList(key, (value: any));
    } else {
      if (!this.entity.hasEntity(componentId)) {
        this.entity.createMap(componentId);
      }
      this.resource.set(key, (value: any));
    }
  }

  update = (key: string, componentId: string, value: Map<string, any> | List<any>, query: {[string]: any}, ctx: ContextType) => {
    if (List.isList(value)) {
      this.filter.update(key, query, componentId);
      const filter = this.filter.getFilter(key, query);
      value = value.filter(filter);
      ctx.response.body = value;
      this.entity.updateCollection(componentId, Entity.ids, value.map((item) => item.get(UNIQUE_ID)));
      this.resource.mergeList(key, (value: any));
    } else {
      if (!this.entity.hasEntity(componentId)) {
        this.entity.createMap(componentId);
      }
      this.resource.merge(key, (value: any));
    }
  }

  subscribe = (key: string, componentId: string, subjectType: SubjectType, observer: rxjs$Observer<*>) => {
    if (!this.entity.hasSubject(componentId, subjectType)) {
      const ids = this.entity.get(componentId).ids;
      let value;
      if (ids) {
        value = this.resource.getList(key, ids);
      } else {
        value = ((this.resource.get(key): any): Map<string, any>);
      }
      // $FlowFixMe
      this.entity.createSubject(componentId, subjectType, value);
    }
    return this.entity.subscribe(componentId, subjectType, observer);
  }

  pushSubject = (componentId: string, subjectType: SubjectType, value: Map<string, any> | List<any>) => {
    const subject = this.entity.getSubject(componentId, subjectType);
    if (subject) {
      subject.next(value);
    }
  }

  mutate = (action: MutateAction): any => {
    switch (action.type) {
      case 'CREATE_ARRAY_ITEM': {
        const {id, key, value} = action.payload;
        this.resource.mergeList(key, new List().push(value));
        const entities = this.filter.getEntities(key, value);
        entities.forEach((componentId) => {
          const ids = this.entity.get(componentId).ids.push(id);
          this.entity.updateCollection(componentId, Entity.ids, ids);
          const collection = this.resource.getList(key, ids);
          this.entity.push(componentId, 'childAdded', value);
          this.entity.push(componentId, 'value', collection);
        });
        return value;
      }
      case 'DELETE_ARRAY_ITEM': {
        const {id, key} = action.payload;
        let resource = this.resource.getList(key);
        // $FlowFixMe
        let childRemoved = resource.get(id);
        const collection = mutate(resource.toList(), action);
        this.resource.setList(key, collection);
        const entities = this.filter.getEntities(key);
        entities.forEach((componentId) => {
          const ids = this.entity.get(componentId).ids.filter((idstring) => idstring !== id);
          this.entity.updateCollection(componentId, Entity.ids, ids);
          // $FlowFixMe
          const collection = this.resource.getList(key, ids);
          this.entity.push(componentId, 'childRemoved', childRemoved);
          this.entity.push(componentId, 'value', collection);
        });
        return null;
      }
      case 'CREATE_ARRAY_NESTED_ITEM':
      case 'DELETE_ARRAY_NESTED_ITEM':
      case 'UPDATE_ARRAY': {
        const {id, key} = action.payload;
        let resource = this.resource.get(key);
        const collection = mutate(resource.toList(), action);
        resource = collection.reduce((acc, item) => acc.set(item.get(UNIQUE_ID), item), new Map());
        const childChanged = resource.get(id);
        this.resource.merge(key, resource);
        const entities = this.filter.getEntities(key);
        entities.forEach((componentId) => {
          const ids = this.entity.get(componentId).ids;
          if (ids.indexOf(id) !== -1) {
            this.entity.push(componentId, 'childChanged', childChanged);
            const collection = this.resource.getList(key, ids);
            this.entity.push(componentId, 'value', collection);
          }
        });
        return childChanged;
      }
      case 'CREATE_OBJECT_NESTED_ITEM':
      case 'UPDATE_OBJECT':
      case 'DELETE_OBJECT_NESTED_ITEM': {
        const {key} = action.payload;
        let resource = this.resource.get(key);
        resource = mutate(resource, action);
        this.resource.merge(key, resource);
        this.entity.push(key, 'value', resource);
        return resource;
      }
      // swap array item do nothing
      case 'SWAP_ARRAY_ITEM':
      case 'SWAP_ARRAY_NESTED_ITEM': {
        const {key, id} = action.payload;
        let resource = this.resource.get(key);
        const collection = mutate(resource.toList(), action);
        resource = collection.reduce((acc, item) => acc.set(item.get(UNIQUE_ID), item), new Map());
        this.resource.merge(key, resource);
        const childChanged = resource.get(id);
        const entities = this.filter.getEntities(key);
        entities.forEach((componentId) => {
          const ids = this.entity.get(componentId).ids;
          if (ids.has(id) !== -1) {
            this.entity.push(componentId, 'childChanged', childChanged);
            const collection = this.resource.getList(key, ids);
            this.entity.push(componentId, 'value', collection);
          }
        });
        return childChanged;
      }
      case 'SWAP_OBJECT_NESTED_ITEM': {
        const {key} = action.payload;
        let resource = this.resource.get(key);
        resource = mutate(resource, action);
        this.resource.merge(key, resource);
        this.entity.push(key, 'value', resource);
        return resource;
      }
      default:
        return null;
    }
  }
}
