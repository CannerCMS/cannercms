import React from 'react';
import {Row, Col, Alert} from 'antd';
import {isEmpty} from 'lodash';
import Label from './Label';
import ErrorMessage from './ErrorMessage';

export default ({
  layout,
  required,
  type,
  description,
  hideTitle,
  imageStorage,
  error,
  title,
  errorInfo,
  children,
}) => {
  const labelCol = layout === 'horizontal' ? this.props.labelCol || {
    span: 6
  } : null;

  const itemCol = layout === 'horizontal' ?  this.props.itemCol || {
    span: 14
  } : null;
  (
    <Row
      type={layout === 'horizontal' ? 'flex' : ''}
      style={{marginBottom: 24}}
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
            <Alert style={{margin: '16px 0'}} message="There is no storage config so you can't upload image. Checkout the storage section to know more" type="warning" />
          )
        }
        {children}
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
}