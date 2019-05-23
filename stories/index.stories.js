import React from 'react';
import {IntlProvider} from 'react-intl';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Context } from 'packages/canner-helpers';
import cannerLocales from 'packages/canner/src/components/locale';
import contextValue from './context';
import CreateBodyDemo from './demos/layouts/createBody';
import ListBodyDemo from './demos/layouts/listBody';
import UpdateBodyDemo from './demos/layouts/updateBody';

import 'antd/dist/antd.css';

const SetFormType = (formType) => {
  const CannerHelperContext = storyFn => (
    <IntlProvider
      locale="en"
      messages={{
        ...cannerLocales['en']
      }}
    >
      <Context.Provider value={contextValue({formType})}>
        <div style={{padding: "20px"}}>
          {storyFn()}
        </div>
      </Context.Provider>
    </IntlProvider>
  );
  return CannerHelperContext;
};

storiesOf('Layout', module)
  .addDecorator(SetFormType('LIST'))
  .add('Body - List', () => <ListBodyDemo />);

storiesOf('Layout', module)
  .addDecorator(SetFormType('CREATE'))
  .add('Body - Create', () => <CreateBodyDemo />);

storiesOf('Layout', module)
  .addDecorator(SetFormType('UPDATE'))
  .add('Body - Update', () => <UpdateBodyDemo />);
