import React from 'react';
import { Row, Col, Alert } from 'antd';
import { isEmpty } from 'lodash';
import { RENDER_TYPE } from '../../hooks/useRenderType';
import Label from './Label';
import ErrorMessage from './ErrorMessage';

export default (props) => {
  const {
    renderChildren,
    refId,
    layout,
    required,
    type,
    description,
    hideTitle,
    imageStorage,
    error,
    title,
    errorInfo,
    renderType,
    render,
  } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const labelCol = layout === 'horizontal' ? props.labelCol || {
    span: 6,
  } : null;

  // eslint-disable-next-line react/destructuring-assignment
  const itemCol = layout === 'horizontal' ? props.itemCol || {
    span: 14,
  } : null;
  return (
    <Row
      type={layout === 'horizontal' ? 'flex' : ''}
      style={{ marginBottom: 24 }}
      // eslint-disable-next-line react/destructuring-assignment
      data-testid={props['data-testid']}
    >
      <Col {...labelCol}>
        <Label
          required={required}
          type={type}
          layout={layout}
          description={description}
          title={hideTitle ? '' : title}
        />
      </Col>
      <Col {...itemCol}>
        {
          (type === 'image' && isEmpty(imageStorage)) && (
            <Alert style={{ margin: '16px 0' }} message="There is no storage config so you can't upload image. Checkout the storage section to know more" type="warning" />
          )
        }
        {renderType === RENDER_TYPE.CHILDREN && renderChildren({ refId })}
        {renderType === RENDER_TYPE.COMPONENT && render(props)}
        {
          error && (
            <ErrorMessage>
              {errorInfo[0].message}
            </ErrorMessage>
          )
        }
      </Col>
    </Row>
  );
};
