# React CMS Code [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> The core of Canner CMS for react

## Installation

```
yarn add @canner/react-cms-core

npm i --save @canner/react-cms-core
```

## Usage
```js
import * as React from 'react';
import {CMS} from '@canner/react-cms-core';

class Demo extends React.Component {
  render() {
    return (
      <CMS {...this.props}/>
    );
  }
}

ReactDOM.render(
  <Demo/>
, document.getElementById('root'));
```

## CMS Props

> WIP

#### required
### schema,
### endpoint,
### plugins,
### containers,
### goTo,
### baseUrl,
### routes,
### params,

#### optional
### hocs,
### loading,
