/**
|--------------------------------------------------
| this is just for copy and past
|--------------------------------------------------
*/


import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {withRelation} from '../../src/hocs/relation';
import {fromJS} from 'immutable';
import { UNIQUE_ID } from '../../src/app/config';
import RefId from 'canner-ref-id';

Enzyme.configure({ adapter: new Adapter() });

describe('hocTemplate', () => {
  let WrapperComponent, props, MockComponent, fetchFromRelationMock;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    };
    fetchFromRelationMock = jest.fn().mockImplementation(() => Promise.resolve({name: 'author'}));
    const rootValue = fromJS([{
      [UNIQUE_ID]: 'id1',
      title: 'POST1',
      author: 'authorId'
    }]);
    props = {
      refId: new RefId('posts'),
      name: 'posts',
      rootValue,
      value: rootValue,
      relation: undefined,
      ui: 'popup',
      pattern: 'array',
      items: {
        type: 'object',
        items: {
          title: {
            type: 'string',
            ui: 'input'
          },
          author: {
            type: 'relation',
            ui: 'one',
            relation: {
              relationship: 'oneToOne',
              relationTo: 'author'
            }
          }
        }
      },
    }
    WrapperComponent = withRelation(MockComponent, fetchFromRelationMock);
  });

  it('should render', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('fetchRelationValue in relation plugin', () => {
    const wrapper = shallow(<WrapperComponent {...props}
      {...props.items.items.author}
      refId={new RefId("posts/0/author")}
      name="author"
      value="authorId"
      pattern="array.relation"
      items={undefined}
    />);
    return wrapper.instance().fetchRelationValue()
      .then(() => {
        expect(wrapper.instance().state.value).toEqual({name: 'author'});
      })
  });

  it('fetchRelationValue in popup plugin', () => {
    const wrapper = shallow(<WrapperComponent {...props} />);
    return wrapper.instance().fetchRelationValue()
      .then(() => {
        expect(wrapper.instance().state.value.toJS()).toEqual([{
          [UNIQUE_ID]: 'id1',
          title: 'POST1',
          author: {
            name: 'author'
          }
        }]);
      })
  });

  it('non fetchRelationValue in normal plugin', () => {
    const wrapper = shallow(<WrapperComponent {...props} items={ {
      type: 'object',
      items: {
        title: {
          type: 'string',
          ui: 'input'
        }
      }
    }} />);
    return wrapper.instance().fetchRelationValue()
      .then(() => {
        expect(wrapper.instance().state.value.toJS()).toEqual([{
          [UNIQUE_ID]: 'id1',
          title: 'POST1',
          author: 'authorId'
        }]);
      })
  });
});