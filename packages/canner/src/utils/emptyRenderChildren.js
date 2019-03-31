import React from 'react'
import { Empty } from "antd";

export default function emptyRenderChildren() {
 return (
   <Empty
    description={(
      <span>
        {`Sorry, you don't have permission to access`}
      </span>
    )}
   >
   </Empty>
 )
}