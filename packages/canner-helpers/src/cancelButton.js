// @flow
import React, {useContext} from 'react';
import Context from './context';

export default function CancelButton(props) {
  const contextValue = useContext(Context);
  const {renderCancelButton, refId} = contextValue;
  console.log(contextValue)
  return <React.Fragment>
    {renderCancelButton({
      refId,
      ...props
    })}
  </React.Fragment>;
}
