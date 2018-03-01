// @flow
import set from 'lodash/set';
import Rx from 'rxjs/Rx';
import unset from 'lodash/unset';
import isFunction from 'lodash/isFunction';
import {List} from 'immutable';
import get from 'lodash/get';
import has from 'lodash/has';

type collectionEntity = {
  ids: List<string>,
  sort: List<any> => List<any>,
  valueSubject?: rxjs$Subject<*>,
  childAddedSubject?: rxjs$Subject<*>,
  childRemovedSubject?: rxjs$Subject<*>,
  childChangedSubject?: rxjs$Subject<*>
}

type mapEntity = {
  valueSubject?: rxjs$Subject<*>
}

function getSubjectName(subjectType: SubjectType): string {
  switch (subjectType) {
    case 'childAdded':
      return 'childAddedSubject';
    case 'childRemoved':
      return 'childRemovedSubject';
    case 'childChanged':
      return 'childChangedSubject';
    case 'value':
    default:
      return 'valueSubject';
  }
}

export default class Entity {
  static ids = 'ids';
  static sort = 'sort';
  static valueSubject = 'valueSubject';
  static childAddedSubject = 'childAddedSubject';
  static childRemovedSubject = 'childRemovedSubject';
  static childChangedSubject = 'childChangedSubject';
  store: {
    [string]: collectionEntity | mapEntity
  }
  constructor() {
    this.store = {};
  }

  replace(re: {path: string, data: {from: string, to: string}}, entities: Array<string>) {
    entities.forEach(entityId => {
      const entity = this.get(entityId);
      if (entity.ids) {
        entity.ids = entity.ids.map(id => {
          if (id === re.data.from) {
            return re.data.to;
          }
          return id;
        });
        this.set(entityId, 'ids', entity.ids);
      }
    });
  }

  createCollection(id: string, ids: List<string>) {
    set(this.store, [id, Entity.ids], ids);
  }

  createMap(id: string) {
    set(this.store, [id], {});
  }

  get(id: string) {
    return get(this.store, [id]);
  }

  getSubject(id: string, subjectType: SubjectType) {
    return get(this.store, [id, getSubjectName(subjectType)]);
  }

  hasSubject(id: string, subjectType: SubjectType) {
    return has(this.store, [id, getSubjectName(subjectType)]);
  }

  createSubject(id: string, subjectType: SubjectType, value: Map<string, any> | List<any>) {
    const subject = new Rx.BehaviorSubject(value);
    if (List.isList(value)) {
      this.updateCollection(id, getSubjectName(subjectType), subject);
    } else {
      this.updateMap(id, getSubjectName(subjectType), subject);
    }
  }

  set(id: string, field: string, value: any) {
    set(this.store, [id, field], value);
  }

  subscribe(id: string, subjectType: SubjectType, observer: rxjs$Observer<*>) {
    const subject = this.getSubject(id, subjectType);
    if (subject) {
      return subject.subscribe(observer);
    }
  }

  push(id: string, subjectType: SubjectType, value: any) {
    const subject = this.getSubject(id, subjectType);
    if (subject) {
      subject.next(value);
    }
  }

  updateMap(id: string, field: string, value: any) {
    switch (field) {
      case Entity.valueSubject:
      default:
        if (value instanceof Rx.Subject) {
          this.set(id, field, value);
          break;
        }
        throw new Error(`Unexpected value type of filed ${field}, should be a Rx.Subject`);
    }
  }

  updateCollection(id: string, field: string, value: any) {
    switch (field) {
      case Entity.ids:
        if (List.isList(value)) {
          this.set(id, field, value);
          break;
        }
        throw new Error(`Unexpected value type of filed ${field}, should be a List`);
      case Entity.sort:
        if (isFunction(value)) {
          this.set(id, field, value);
          break;
        }
        throw new Error(`Unexpected value type of filed ${field}, should be a function`);
      case Entity.valueSubject:
      case Entity.childAddedSubject:
      case Entity.childChangedSubject:
      case Entity.childRemovedSubject:
        if (value instanceof Rx.Subject) {
          this.set(id, field, value);
          break;
        }
        throw new Error(`Unexpected value type of filed ${field}, should be a Rx.Subject`);
      default:
        throw new Error(`there is no valid field called ${field}`);
    }
  }

  delete(id: string) {
    unset(this.store, [id]);
  }

  hasEntity(id: string): boolean {
    return id in this.store;
  }
}
