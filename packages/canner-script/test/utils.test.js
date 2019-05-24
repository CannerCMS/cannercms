import TestRenderer from 'react-test-renderer';
import * as React from 'react';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import { componentMap, getIntlMessage } from '../src/utils';

describe('componentMap', () => {
  it('should get a name if has one', () => {
    expect(componentMap.get('string', 'input')).toBe('@canner/antd-string-input');
  });

  it('should get a default name if no ui is given', () => {
    expect(componentMap.get('string')).toBe('@canner/antd-string-input');
  });

  it('should throw an error if there is no ui called this name', () => {
    expect(() => componentMap.get('string', 'customize-ui')).toThrow(/there is no ui/);
  });

  it('should throw erro if there is no type', () => {
    expect(() => componentMap.get('fdsa')).toThrow(/there is no type/);
  });

  it('should set a new ui', () => {
    componentMap.set('string.ha', 'ha');
    expect(componentMap.get('string', 'ha')).toBe('ha');
  });
});

describe('getIntlMessage', () => {
  it('should be string, if not match /${(,*)}/', () => {
    const message = getIntlMessage('title');
    expect(message).toBe('title');
  });

  it('should be a react component', () => {
    const message = getIntlMessage('${title}');
    function Intl() {
      return (
        <IntlProvider locale="en" messages={{ title: 'Title' }}>
          {message}
        </IntlProvider>
      );
    }
    const testInstance = TestRenderer.create(<Intl />).root;
    expect(testInstance.findByType(FormattedHTMLMessage).props.id).toBe('title');
  });
});
