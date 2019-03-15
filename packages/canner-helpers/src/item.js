// @flow
import React, {useContext} from 'react';
import Context from './context';
import {isFunction, isEqual} from 'lodash';

type Props = {
  [string]: any
};

export default React.memo(function Item({filter, ...rest}: Props) {
  const {renderChildren, refId, routes} = useContext(Context);
  return (
    renderChildren(
      filter ? 
        (node, index) => ({refId, routes, hidden: !filter(node, index), ...rest}):
        {
          refId,
          routes,
          ...rest
        }
    )
  );
})