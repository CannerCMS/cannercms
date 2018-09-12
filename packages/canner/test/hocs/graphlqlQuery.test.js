import React from 'react';
import withQuery from '../../src/hocs/graphqlQuery';
import { MockedProvider } from "react-apollo/test-utils";
import Enzyme, {shallow} from 'enzyme';
import gql from 'graphql-tag';
import Adapter from 'enzyme-adapter-react-16.3';
import toJson from 'enzyme-to-json';
Enzyme.configure({ adapter: new Adapter() });

describe('graphql query', () => {
  let MockComponent, graphql, GET_QUERY, WrapperedComponent, mocks;
  beforeEach(() => {
    MockComponent = function MockComponent() {
      return <div>123</div>;
    }
    graphql = `
      query test($first: Int) {
        test(first: $first) {
          name
        }
      }
    `;
    GET_QUERY = gql`${graphql}`;
    WrapperedComponent = withQuery(MockComponent);

    mocks = [{
      request: {
        query: GET_QUERY,
        variables: {first: 1}
      },
      result: {
        data: {
          test: [{
            id: 'id1',
            name: 'test1'
          }]
        }
      }
    }, {
      request: {
        query: GET_QUERY,
        variables: {first: 3}
      },
      result: {
        data: {
          test: [{
            id: 'id1',
            name: 'test1'
          }, {
            id: 'id2',
            name: 'test2'
          }, {
            id: 'id3',
            name: 'test3'
          }]
        }
      }
    }];
  })

  it('component should get value and props', () => {
    const wrapper = shallow(
      <MockedProvider mocks={mocks}>
        <WrapperedComponent
          graphql={graphql}
          variables={{first: 1}}
          getValue={v => v.length}
        />
      </MockedProvider>
    );
    wrapper.update();
    expect(wrapper.find(MockComponent).prop('value')).toBe(1);
    expect(wrapper.find(MockComponent).props).toHaveProperty('refetch');
    expect(wrapper.find(MockComponent).props).toHaveProperty('goTo');
  });

  it('value should change', () => {
    const wrapper = shallow(
      <MockedProvider mocks={mocks}>
        <WrapperedComponent
          graphql={graphql}
          variables={{first: 1}}
          getValue={v => v.length}
        />
      </MockedProvider>
    );

    expect(wrapper.find(MockComponent).prop('value')).toBe(1);
    return wrapper.find(MockComponent).prop('refetch')({
      first: 3
    }).then(() => {
      expect(wrapper.find(MockComponent).prop('value')).toBe(3);
    });
  });
});