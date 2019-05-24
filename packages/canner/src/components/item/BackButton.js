import React, { useContext } from 'react';
import { Button, Icon, Modal } from 'antd';
import { Context } from 'canner-helpers';
import { injectIntl } from 'react-intl';

const { confirm } = Modal;

export default injectIntl(BackButton);
function BackButton({ intl, hideBackButton }) {
  const {
    goTo, routes, routerParams, reset, refId, dataChanged,
  } = useContext(Context);
  const onClick = () => {
    const resetCondFn = () => {
      if (routerParams.operator === 'create') {
        reset(refId.getPathArr()[0]).then(() => !hideBackButton && goTo({ pathname: routes.join('/') }));
      } else {
        reset(refId.getPathArr()[0]).then(() => !hideBackButton && goTo({ pathname: routes.slice(0, -1).join('/') }));
      }
    };
    if (dataChanged && Object.keys(dataChanged).length > 0) {
      confirm({
        title: intl.formatMessage({ id: 'hocs.route.confirm.title' }),
        content: intl.formatMessage({ id: 'hocs.route.confirm.content' }),
        okText: intl.formatMessage({ id: 'hocs.route.confirm.okText' }),
        cancelText: intl.formatMessage({ id: 'hocs.route.confirm.cancelText' }),
        onOk: () => new Promise((resolve) => {
          setTimeout(resolve, 200);
        }).then()
          .then(() => {
            resetCondFn();
          }),
        onCancel: () => {
        },
      });
    } else {
      resetCondFn();
    }
  };

  return (
    <Button onClick={onClick} style={{ marginBottom: 16 }} data-testid="back-button">
      <Icon type="arrow-left" />
      {' '}
      {intl.formatMessage({ id: 'hocs.route.backText' })}
    </Button>
  );
}
