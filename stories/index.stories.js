import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import { Context } from 'packages/canner-helpers';
import contextValue from './context';

import 'antd/dist/antd.css';

const CannerHelperContext = storyFn => (
  <Context.Provider value={contextValue()}>
    <div style={{padding: "20px"}}>
      {storyFn()}
    </div>
  </Context.Provider>
);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
