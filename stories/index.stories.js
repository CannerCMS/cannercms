import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Context } from 'packages/canner-helpers';
import contextValue from './context';

import BodyDemo from './demos/layouts/body';

import 'antd/dist/antd.css';

const CannerHelperContext = storyFn => (
  <Context.Provider value={contextValue()}>
    <div style={{padding: "20px"}}>
      {storyFn()}
    </div>
  </Context.Provider>
);

storiesOf('Layout', module)
  .addDecorator(CannerHelperContext)
  .add('Body', () => <BodyDemo />);
