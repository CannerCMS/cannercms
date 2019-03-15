import React from 'react';
import {Row, Col, Alert} from 'antd';
import {isEmpty, isEqual, isFunction} from 'lodash';
import Label from './Label';
import ErrorMessage from './ErrorMessage';
import Buttons from './Buttons';
import {RENDER_TYPE} from '../../hooks/useRenderType';

export default React.memo(function CannerItem(props) {
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
    shouldRenderSubmitButton,
    shouldRenderCancelButton
  } = props;
  const labelCol = layout === 'horizontal' ? props.labelCol || {
    span: 6
  } : null;

  const itemCol = layout === 'horizontal' ?  props.itemCol || {
    span: 14
  } : null;
  return (
    <Row
      type={layout === 'horizontal' ? 'flex' : ''}
      style={{marginBottom: 24}}
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
            <Alert style={{margin: '16px 0'}} message="There is no storage config so you can't upload image. Checkout the storage section to know more" type="warning" />
          )
        }
        {renderType === RENDER_TYPE.CHILDREN && renderChildren({refId})}
        {renderType === RENDER_TYPE.COMPONENT && render(props)}
        <Buttons
          shouldRenderCancelButton={shouldRenderCancelButton}
          shouldRenderSubmitButton={shouldRenderSubmitButton}
        />
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
}, function(prevProps, nextProps) {
  return Object.entries(nextProps).reduce((eq, [k, v]) => {
    if (isFunction(v)) {
      return eq;
    }
    if (k === 'refId') {
      return eq && prevProps[k].toString() === v.toString();
    }
    return isEqual(v, prevProps[k]) && eq;
  }, true)
});