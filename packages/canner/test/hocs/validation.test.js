import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import withValidationn from '../../src/hocs/validation';
import RefId from 'canner-ref-id';


Enzyme.configure({ adapter: new Adapter() });

describe('withValidation', () => {
  let WrapperComponent, props, MockComponent, onDeploy, removeOnDeploy;

  beforeEach(() => {
    MockComponent = function MockComponent() {
      return (<div>Component</div>);
    }
    onDeploy = jest.fn();
    removeOnDeploy = jest.fn();
    props = {
      refId: new RefId('posts/0/url'),
      onDeploy,
      removeOnDeploy
    }
    WrapperComponent = withValidationn(MockComponent);
  });

  it('should error state = false', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
    />);
    expect(wrapper.state()).toEqual({
      error: false,
      errorInfo: []
    })
  });

  it('should onDeploy be called', () => {
    const wrapper =  mount(<WrapperComponent
      {...props}
      required
    />);
    expect(onDeploy).toBeCalledWith('posts', wrapper.instance().validate);
  });

  it('should pass validation', () => {
    const result = {
      data: {
        0: { url: 'https://'}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      required
    />);
    expect(wrapper.state()).toEqual({
      error: false,
      errorInfo: []
    })
  });

  it('should not pass required validation', () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      required
    />);
    expect(wrapper.state()).toEqual({
      error: true,
      errorInfo: [{
        message: 'should be required'
      }]
    })
  });

  it('should not pass ajv validation', () => {
    const result = {
      data: {
        0: { url: 'imgurl.com'}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      required
      validation={{pattern: '^http://[.]+'}}
    />);
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: 'should match pattern "^http://[.]+"'
      }]
    })
  });

  it('should not pass ajv validation with custom error message', () => {
    const result = {
      data: {
        0: { url: 'imgurl.com'}
      }
    };
    const errorMessage = 'custom error';
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      required
      validation={{pattern: '^http://[.]+', errorMessage}}
    />);
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: errorMessage
      }]
    })
  });

  it('should pass ajv validation if empty', () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      validation={{pattern: '^http://[.]+'}}
    />);
    expect(wrapper.state()).toMatchObject({
      error: false,
      errorInfo: []
    })
  });

  it('should use custom validation', () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      onDeploy={jest.fn().mockImplementation((_, fn) => (fn(result)))}
      validation={
        {
          validator: (content, reject) => {
            if (!content) {
              return reject('should be required');
            }
          }
        }
      }
    />);
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: 'should be required'
      }]
    })
  });

  it('should removeOnDeploy not be called', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
    />);
    wrapper.unmount();
    expect(removeOnDeploy).not.toBeCalled();
  });

  it('should removeOnDeploy be called', () => {
    const wrapper = mount(<WrapperComponent
      {...props}
    />);
    const callbackId = 1;
    wrapper.instance().callbackId = callbackId;
    wrapper.unmount();
    expect(removeOnDeploy).toBeCalledWith('posts', callbackId);
  });
});