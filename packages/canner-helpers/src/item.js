// @flow
import React, {useContext} from 'react';
import Context from './context';

type Props = {
  [string]: any
};

export default function Item({filter, ...rest}: Props) {
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
}