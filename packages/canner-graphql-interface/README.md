# graphql-resolver
## possible customization
* add operators to where
* change sort payload
* change pagination payload
* customized scalar
* add args to list/nestedList/relation query
* add args to scalar

## install
``` sh
yarn add @canner/graphql-resolver
```

## usage
``` js
import {createClient} from '@canner/graphql-resolver';
const apolloClient = createClient({
  schema,
  defaultData
});
```

## options
* schema: https://github.com/Canner/graphql-resolver/blob/master/docs/index.tsx#L31-L140
* defaultData: https://github.com/Canner/graphql-resolver/blob/master/docs/index.tsx#L10-L29
