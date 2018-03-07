# React CMS Code 
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
      <CMS
        {...props}
      />
    );
  }
}

ReactDOM.render(
  <Demo/>
, document.getElementById('root'));
```

## CMS Props

> WIP

### required
---
#### schema
```js
schema: {
  schema: {},
  componentTree: {},
  endpoint: {},
},
```
#### components
```js
{
  {[type: string]: {
    [ui: string]: CannerComponent
  }}
}
```
#### containers
```js
{
  [containerName: string]: CannerContainer
}
```
#### goTo
```js
(path: string) => void
```
#### baseUrl

```js
string
```
#### routes
```js
Array<string>
```
#### params
``` js
{
  op?: 'create',
  payload?: string, // json string
  backUrl?: string
}
```
### optional
---
#### hocs
```js
{
  [hocName: string]: CannerHOC
}
```