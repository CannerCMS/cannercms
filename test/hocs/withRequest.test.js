/**
|--------------------------------------------------
| this test is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import withRequest from '../../src/hocs/withRequest';
import {fromJS} from 'immutable';
import {UNIQUE_ID} from '../../src/app/config';

Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
  let WrapperComponent, props, MockComponent;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
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
      }
    }
    WrapperComponent = withRequest(MockComponent);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('onChang function', () => {
    it('should call context.request with arguments action', () => {
      const request = jest.fn();
      const wrapper = shallow(<WrapperComponent {...props} />, {
        context: {
          request: action => {
            request(action);
            return Promise.resolve();
          }
        }
      });
      const id = props.id;
      const type = 'create';
      const delta = fromJS({
        [UNIQUE_ID]: 'id2',
        title: 'post2'
      });
      wrapper.instance().onChange(id, type, delta).then(() => {
        expect(request.mock.calls[0][0]).toBeTruthy();
      });
    });

    it('should accept changeQueue', () => {
      const request = jest.fn();
      const wrapper = shallow(<WrapperComponent {...props} />, {
        context: {
          request: action => {
            request(action);
            return Promise.resolve();
          }
        }
      });
      const id = props.id;
      const type = 'create';
      const delta = i => fromJS({
        title: `post${i}`
      });
      const changeQueue = [2,3,4,5].map(i => ({id, type, value: delta(i)}));
      return wrapper.instance().onChange(changeQueue)
        .then(() => {
          expect(request.mock.calls.length).toBe(4);
        });
    });

    it('should fetch relation if relationship is foreignKey', () => {
      const request = jest.fn();
      const fetchRelation = jest.fn();
      const wrapper = shallow(<WrapperComponent {...props}
          fetchRelation={fetchRelation}
          relation={{
            relationship: 'oneToMany.foreignKey'
          }}
        />, {
        context: {
          request: action => {
            request(action);
            return Promise.resolve();
          }
        }
      });
      const id = props.id;
      const type = 'create';
      const delta = fromJS({
        title: `post2`
      });
      return wrapper.instance().onChange(id, type, delta)
        .then(() => {
          expect(request.mock.calls.length).toBe(1);
          expect(fetchRelation.mock.calls.length).toBe(1);
        });
    });
  });
});