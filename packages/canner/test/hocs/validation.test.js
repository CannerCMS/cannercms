import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import withValidation from '../../src/hocs/validation';
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
    WrapperComponent = withValidation(MockComponent);
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

  it('should pass validation', async () => {
    const result = {
      data: {
        0: { url: 'https://'}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      required
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toEqual({
      error: false,
      errorInfo: []
    })
  });

  it('should not pass required validation', async () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      required
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toEqual({
      error: true,
      errorInfo: [{
        message: 'should be required'
      }]
    })
  });

  it('should not pass ajv validation', async () => {
    const result = {
      data: {
        0: { url: 'imgurl.com'}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      required
      validation={{schema: {pattern: '^http://[.]+'}}}
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: 'should match pattern "^http://[.]+"'
      }]
    })
  });

  it('should not pass ajv validation with custom error message', async () => {
    const result = {
      data: {
        0: { url: 'imgurl.com'}
      }
    };
    const errorMessage = 'custom error';
    const wrapper =  mount(<WrapperComponent
      {...props}
      required
      validation={{schema: {pattern: '^http://[.]+'}, errorMessage}}
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: errorMessage
      }]
    })
  });

  it('should pass ajv validation if empty', async () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      validation={{schema: {pattern: '^http://[.]+'}}}
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: false,
      errorInfo: []
    })
  });

  it('should use customized validator with error message', async () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      validation={
        {
          validator: (content) => {
            if (!content) {
              return 'error message as return value';
            }
          }
        }
      }
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: 'error message as return value'
      }]
    })
  });

  it('should use customized validator with throwing error', async () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      validation={
        {
          validator: () => {
              throw 'Throw error'
          }
        }
      }
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: true,
      errorInfo: [{
        message: 'Throw error'
      }]
    })
  });


  it('should use customized validator with void return', async () => {
    const result = {
      data: {
        0: { url: ''}
      }
    };
    const wrapper =  mount(<WrapperComponent
      {...props}
      validation={
        {
          validator: () => {}
        }
      }
    />);
    await wrapper.instance().validate(result)
    expect(wrapper.state()).toMatchObject({
      error: false,
      errorInfo: []
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