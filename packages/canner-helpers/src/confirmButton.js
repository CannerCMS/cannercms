// @flow
import React, {useContext} from 'react';
import Context from './context';

export default function CancelButton(props) {
  const contextValue = useContext(Context);
  const {renderConfirmButton, refId} = contextValue;
  return <React.Fragment>
    {renderConfirmButton({
      refId,
      ...props
    })}
  </React.Fragment>;
}
