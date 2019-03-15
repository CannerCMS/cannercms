import React from 'react';
import {ResetButton, ConfirmButton} from 'canner-helpers';
export default function Buttons({
  shouldRenderCancelButton,
  shouldRenderSubmitButton
}) {
  return <React.Fragment>
    {
      (shouldRenderCancelButton || shouldRenderSubmitButton) && (
        <div
          style={{
            textAlign: "right",
            marginTop:  60
          }}
        >
          {shouldRenderCancelButton && <ResetButton style={{marginRight: 16}} />}
          {shouldRenderSubmitButton && <ConfirmButton />}
        </div>
      )
    }
  </React.Fragment>
}