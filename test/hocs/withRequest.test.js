/**
|--------------------------------------------------
| this test is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withRequest, {createAction} from '../../src/hocs/withRequest';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/app/config';

Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
  let WrapperComponent, props, MockComponent, mockRequest;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    mockRequest = jest.fn().mockImplementation(() => Promise.resolve());
    const rootValue = fromJS([{
      [UNIQUE_ID]: 'id1',
      title: 'post1'
    }]);
    props = {
      id: 'POSTS',
      value: rootValue,
      rootValue,
      relation: undefined,
      fetchRelation: () => {
      },
    request: mockRequest
    }
    WrapperComponent = withRequest(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('onChang function', () => {
    it('should call props.request with arguments action', () => {
      const wrapper = shallow(<WrapperComponent {...props} />);
      const id = props.id;
      const type = 'create';
      const delta = fromJS({
        [UNIQUE_ID]: 'id2',
        title: 'post2'
      });
      wrapper.instance().onChange(id, type, delta).then(() => {
        expect(mockRequest.mock.calls[0][0]).toBeTruthy();
      });
    });

    it('should accept changeQueue', () => {
      const wrapper = shallow(<WrapperComponent {...props} />);
      const id = props.id;
      const type = 'create';
      const delta = i => fromJS({
        title: `post${i}`
      });
      const changeQueue = [2,3,4,5].map(i => ({id, type, value: delta(i)}));
      return wrapper.instance().onChange(changeQueue)
        .then(() => {
          expect(mockRequest.mock.calls.length).toBe(4);
        });
    });

    it('should fetch relation if relationship is foreignKey', () => {
      const fetchRelation = jest.fn();
      const wrapper = shallow(<WrapperComponent {...props}
          fetchRelation={fetchRelation}
          relation={{
            relationship: 'oneToMany.foreignKey'
          }}
        />);
      const id = props.id;
      const type = 'create';
      const delta = fromJS({
        title: `post2`
      });
      return wrapper.instance().onChange(id, type, delta)
        .then(() => {
          expect(mockRequest.mock.calls.length).toBe(1);
          expect(fetchRelation.mock.calls.length).toBe(1);
        });
    });
  });
});


describe('createAction', () => {
  describe('create onChange', () => {
    it('create with delta should merge with emptyData', () => {
      const action = createAction({
        id: 'posts',
        type: 'create',
        delta: fromJS({
          [UNIQUE_ID]: 'id2',
          title: 'post2'
        }),
        value: fromJS([]),
        rootValue: fromJS([]),
        items: {
          title: {
            type: 'string'
          },
          field: {
            type: 'number'
          }
        }
      })
      expect(action.type).toBe('CREATE_ARRAY_ITEM');
      expect(action.payload.value.toJS()).toMatchObject({
        title: 'post2',
        field: 0
      });
    });

    it('create with delta should not merge with emptyData', () => {
      const action = createAction({
        id: 'posts',
        type: 'create',
        delta: fromJS({
          [UNIQUE_ID]: 'id2',
          title: 'post2'
        }),
        config: true, // this will cause unmerged
        value: fromJS([]),
        rootValue: fromJS([]),
        items: {
          title: {
            type: 'string'
          },
          field: {
            type: 'number'
          }
        }
      })
      expect(action.type).toBe('CREATE_ARRAY_ITEM');
      expect(action.payload.value.toJS()).toMatchObject({
        title: 'post2'
      });
    });

    it('create without delta should create emptyData', () => {
      const action = createAction({
        id: 'posts',
        type: 'create',
        config: false, // this will cause unmerged
        value: fromJS([]),
        rootValue: fromJS([]),
        items: {
          title: {
            type: 'string'
          },
          field: {
            type: 'number'
          }
        }
      })
      expect(action.type).toBe('CREATE_ARRAY_ITEM');
      expect(action.payload.value.toJS()).toMatchObject({
        title: '',
        field: 0
      });
    });
  });
})