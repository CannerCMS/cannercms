import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RefId from 'canner-ref-id';
import { Item, LiteCMS } from 'canner-helpers';
import { store, wrap } from '../src';

Enzyme.configure({ adapter: new Adapter() });

const mockArrayComponent = ({ refId }) => (
  <div>
    component1
    <Item refId={refId.child(0)} />
  </div>
);

const mockObjectComponent = () => (
  <Item />
);

const mockStringComponent = ({ value, onChange, refId }) => (
  <input value={value} onChange={e => onChange(refId, 'update', e.target.value)} />
);

const mockLiteCMSComponent = () => (
  <LiteCMS />
);

const WrappedArrayComponent = wrap(mockArrayComponent);
const WrappedObjectComponent = wrap(mockObjectComponent);
const WrappedStringComponent = wrap(mockStringComponent);
const WrappedLiteCMSComponent = wrap(mockLiteCMSComponent);


describe('wrap simple', () => {
  it('should has props: refId, value and onChange', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });

    const wrapper = mount(<WrappedStringComponent keyName="info/test" />);
    expect(wrapper.find('input').prop('value')).toBe('123');
    wrapper.find('input').simulate('change', { target: { value: '321' } });
    expect(wrapper.find('input').prop('value')).toBe('321');
  });

  it('should support onChange to listen', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });
    const mockOnChange = jest.fn();
    const wrapper = mount(<WrappedStringComponent keyName="info/test" onChange={mockOnChange} />);
    wrapper.find('input').simulate('change', { target: { value: '321' } });
    expect(mockOnChange).toBeCalledWith(expect.any(RefId), 'update', '321');
  });

  it('should support item', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });

    const wrapper = mount(<WrappedObjectComponent keyName="info/test" />);
    expect(wrapper.find(mockObjectComponent).children().length).toBe(1);
  });

  it('should support customize item', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });

    const MyItem = jest.fn().mockImplementation(() => 'my item');
    const wrapper = mount(
      <WrappedObjectComponent keyName="info/test">
        <MyItem />
      </WrappedObjectComponent>
    );
    expect(MyItem.mock.calls[0][0]).toEqual({
      refId: expect.any(RefId),
    });
    expect(wrapper.find(mockObjectComponent).text()).toBe(MyItem());
  });

  it('should support liteCMS', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });
    const wrapper = mount(<WrappedLiteCMSComponent keyName="info/test" />);
    expect(wrapper.find(mockLiteCMSComponent).children().length).toBe(1);
  });
});

describe('wrap comlex', () => {
  it('should support customize item get value', () => {
    store.setValue({
      info: {
        test: '123',
      },
    });
    const wrapper = mount(
      <WrappedObjectComponent
        keyName="info"
      >
        <WrappedStringComponent
          keyName="test"
        />
      </WrappedObjectComponent>
    );
    expect(wrapper.find('input').prop('value')).toBe('123');
    wrapper.find('input').simulate('change', { target: { value: '321' } });
    expect(wrapper.find('input').prop('value')).toBe('321');
  });

  it('should support customize array item get value', () => {
    store.setValue({
      posts: [{
        test: '123',
      }],
    });
    const wrapper = mount(
      <WrappedArrayComponent
        keyName="posts"
      >
        <WrappedStringComponent
          keyName="test"
        />
      </WrappedArrayComponent>
    );
    expect(wrapper.find('input').prop('value')).toBe('123');
    wrapper.find('input').simulate('change', { target: { value: '321' } });
    expect(wrapper.find('input').prop('value')).toBe('321');
  });

  it('should support customize complex item', () => {
    store.setValue({
      users: [{
        basicInfo: {
          name: '123',
          nickname: '321',
        },
        addresses: [{
          type: 'home',
          value: 'xxxxxx',
        }],
        username: 'haha',
      }],
    });
    const wrapper = mount(
      <WrappedArrayComponent
        keyName="users"
      >
        <WrappedObjectComponent keyName="basicInfo">
          <WrappedStringComponent keyName="name" />
          <WrappedStringComponent keyName="nickname" />
        </WrappedObjectComponent>
        <WrappedArrayComponent keyName="addresses">
          <WrappedStringComponent keyName="type" className="type" />
          <WrappedStringComponent keyName="value" className="value" />
        </WrappedArrayComponent>
        <WrappedStringComponent keyName="username" />
      </WrappedArrayComponent>
    );
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.find('.type input')
      .simulate('change', { target: { value: 'company' } });
    wrapper.find('.value input')
      .simulate('change', { target: { value: 'yyyyy' } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
