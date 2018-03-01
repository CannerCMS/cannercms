/* eslint new-cap: ["error", { "capIsNewExceptions": ["Map"] }]*/
import {
  CollectionCreate,
  CollectionUpdate,
  CollectionDelete,
  MapUpdate,
  types
} from '../src/actions';
import ChangeAdaptor from '../src/changeAdaptor';
import {UNIQUE_ID} from '../src/config';
// $FlowFixMe
import immutable from 'immutable';
import {times} from 'lodash';
import faker from 'faker';
import Localstorage from '../src/endpoint/localstorage';

CollectionCreate.prototype.callApi = function() {
  return Promise.resolve();
};

CollectionUpdate.prototype.callApi = function() {
  return Promise.resolve();
};

CollectionDelete.prototype.callApi = function() {
  return Promise.resolve();
};

MapUpdate.prototype.callApi = function() {
  return Promise.resolve();
};
const schema = {};
const endpoint = new Localstorage({schema});
const fake = () => ({
  _id: endpoint.generateUniqueId(),
  title: faker.lorem.slug(),
  content: faker.lorem.sentence(),
  members: [{
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber()
  }, {
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber()
  }]
});

const originData = immutable.fromJS({
  posts: times(5, fake),
  header: {
    nestedPosts: times(5, fake),
    title: "cool",
    location: {
      lat: 1,
      lng: 2
    }
  }
});

describe('changeAdaptor', () => {
  describe('createAction', () => {
    it('should create collection data', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: "posts",
        type: "create",
        value: immutable.Map({
          title: "new",
          content: "new"
        }),
        dataType: types.collection,
        endpoint
      };
      const action = changeAdaptor.createAction(change);
      const mutatedData = action.mutate(originData.get('posts'));
      expect(mutatedData.size).toEqual(6);
      expect(mutatedData.last().toJS()).toHaveProperty('title', 'new');
      expect(mutatedData.last().toJS()).toHaveProperty('content', 'new');
    });

    it('should update collection data', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}`,
        type: "update",
        value: immutable.Map({
          title: "new"
        }),
        dataType: types.collection,
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.size).toEqual(5);
      expect(mutatedData.first().toJS()).toHaveProperty('title', 'new');
    });

    it('should delete collection data', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}`,
        type: "delete",
        dataType: types.collection,
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.size).toEqual(4);
    });

    it('should create nested collection item', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members`,
        type: "create",
        dataType: types.collection,
        value: immutable.Map({
          name: "new",
          phone: "new"
        }),
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.getIn([0, 'members']).size).toEqual(3);
      expect(mutatedData.getIn([0, 'members', 2]).get('name')).toEqual('new');
      expect(mutatedData.getIn([0, 'members', 2]).get('phone')).toEqual('new');
    });

    it('should update nested collection item with map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members/1`,
        type: "update",
        dataType: types.collection,
        value: immutable.Map({
          name: "new",
          phone: "new"
        }),
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.getIn([0, 'members']).size).toEqual(2);
      expect(mutatedData.getIn([0, 'members', 1]).get('name')).toEqual('new');
      expect(mutatedData.getIn([0, 'members', 1]).get('phone')).toEqual('new');
    });

    it('should update nested collection item prop', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members/1/name`,
        type: "update",
        dataType: types.collection,
        value: "new",
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.getIn([0, 'members']).size).toEqual(2);
      expect(mutatedData.getIn([0, 'members', 1]).get('name')).toEqual('new');
    });

    it('should delete nested collection item', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members/0`,
        type: "delete",
        dataType: types.collection,
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.getIn([0, 'members']).size).toEqual(1);
    });

    it('should swap nested collection item', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const firstValue = originData.getIn(['posts', 0, 'members', 0]);
      const secondValue = originData.getIn(['posts', 0, 'members', 1]);
      const change = {
        id: {
          firstId: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members/0`,
          secondId: `posts/${originData.getIn(['posts', 0, UNIQUE_ID])}/members/1`
        },
        type: "swap",
        dataType: types.collection,
        endpoint
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('posts'));
      expect(mutatedData.getIn([0, 'members', 0]).toJS()).toEqual(secondValue.toJS());
      expect(mutatedData.getIn([0, 'members', 1]).toJS()).toEqual(firstValue.toJS());
    });

    it('should update map with map value', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: "header",
        type: "update",
        dataType: types.map,
        endpoint,
        value: immutable.fromJS({
          title: "new title",
          nestedPosts: times(1, fake)
        })
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual('new title');
      expect(mutatedData.getIn(['nestedPosts']).size).toEqual(1);
    });

    it('should update map with nested object prop', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: "header/location/lat",
        type: "update",
        dataType: types.map,
        endpoint,
        value: 10
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual("cool");
      expect(mutatedData.getIn(['location', 'lat'])).toEqual(10);
    });

    it('should create nested array item in map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `header/nestedPosts`,
        type: "create",
        dataType: types.map,
        endpoint,
        value: immutable.fromJS({
          name: "new",
          phone: "new"
        })
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual("cool");
      expect(mutatedData.getIn(['nestedPosts', 5]).toJS()).toEqual({
        name: "new",
        phone: "new"
      });
    });

    it('should update nested array item in map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `header/nestedPosts/0`,
        type: "update",
        dataType: types.map,
        endpoint,
        value: immutable.fromJS({
          name: "new",
          phone: "new"
        })
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual("cool");
      expect(mutatedData.getIn(['nestedPosts', 0, 'name'])).toEqual("new");
      expect(mutatedData.getIn(['nestedPosts', 0, 'phone'])).toEqual("new");
    });

    it('should update nested array item with string in map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `header/nestedPosts/0/name`,
        type: "update",
        dataType: types.map,
        endpoint,
        value: "new"
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual("cool");
      expect(mutatedData.getIn(['nestedPosts', 0, 'name'])).toEqual("new");
    });

    it('should delete nested array item in map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const change = {
        id: `header/nestedPosts/0`,
        type: "delete",
        dataType: types.map,
        originData
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['title'])).toEqual("cool");
      expect(mutatedData.getIn(['nestedPosts']).size).toEqual(4);
    });

    it('should swap nested array item in map', () => {
      const changeAdaptor = new ChangeAdaptor({});
      const firstValue = originData.getIn(['header', 'nestedPosts', 0]);
      const secondValue = originData.getIn(['header', 'nestedPosts', 1]);
      const change = {
        id: {
          firstId: `header/nestedPosts/0`,
          secondId: `header/nestedPosts/1`
        },
        type: "swap",
        dataType: types.map,
        originData
      };
      const mutatedData = changeAdaptor.createAction(change).mutate(originData.get('header'));
      expect(mutatedData.getIn(['nestedPosts', 0]).toJS()).toEqual(secondValue.toJS());
      expect(mutatedData.getIn(['nestedPosts', 1]).toJS()).toEqual(firstValue.toJS());
    });
  });
});
