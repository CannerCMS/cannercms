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
        node => ({refId, routes, hidden: !filter(node), ...rest}):
        {
          refId,
          routes,
          ...rest
        }
    )
  );
})