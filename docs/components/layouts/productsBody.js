// @flow

import * as React from 'react';
import { Breadcrumb, Icon, Card } from 'antd';
import { Item, BackButton, ConfirmAndCancelButtons } from 'canner-helpers';
import { FORM_TYPE } from '../../../packages/canner/src/hooks/useFormType';

type Props = {
  id: string,
  title: string,
  description: string,

  schema: Object,
  routes: Array<string>
};

export default (props: Props) => {
  const {
    title, description, schema, routes,
    formType
  } = props;
  const key = routes[0];
  const item = schema[key];
  const breadcrumbs = [{
    path: 'home',
    render: () => <Icon type="home" />
  }, {
    path: routes[0],
    render: () => item.title || title
  }];
  const itemRender = route => route.render();
  return (
    <div>
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #eee',
          padding: '16px 24px',
          position: 'relative'
        }}
      >
        <div
          style={{
            marginBottom: 24
          }}
        >
          <Breadcrumb itemRender={itemRender} routes={breadcrumbs} />
        </div>
        <h2>{item.title || title}</h2>
        {
          (item.description || description) && (
            <div
              style={{
                marginTop: 8,
                width: '60%'
              }}
            >
              {item.description || description}
            </div>
          )
        }
        <Links />
        <img
          alt="img"
          src="https://cdn.canner.io/images/innerPages/banner.png"
          height="80%"
          style={{
            position: 'absolute',
            right: '10%',
            bottom: '10px'
          }}
        />
      </div>
      <div
        style={{
          padding: '16px',
          background: '#f0f2f5',
          minHeight: '100vh'
        }}
      >
        {
          (formType === FORM_TYPE.CREATE
          || formType === FORM_TYPE.UPDATE)
          && (
            <BackButton />
          )
        }
        <Card>
          <Item />
        </Card>
        {
          (formType === FORM_TYPE.CREATE
          || formType === FORM_TYPE.UPDATE)
          && (
            <ConfirmAndCancelButtons
              shouldRenderSubmitButton
              shouldRenderCancelButton
            />
          )
        }
      </div>
    </div>
  );
};

function Link({ icon, name, link }) {
  return (
    <a href={link} target="__blank" style={{ marginRight: 36 }}>
      <Icon
        type={icon}
        theme="outlined"
        style={{
          padding: 8, border: '1px solid', borderRadius: '50%', marginRight: 8
        }}
      />
      {name}
    </a>
  );
}

function Links() {
  return (
    <div
      style={{ marginTop: 24, fontSize: 16, fontWeight: 100 }}
    >
      {/* eslint-disable-next-line */}
      <Link
        icon="file-text"
        name="Schema"
        link="https://github.com/Canner/canner/blob/canary/docs/schema/products.schema.js"
      />
      {/* eslint-disable-next-line */}
      <Link
        icon="code"
        name="Customized Body"
        link="https://github.com/Canner/canner/blob/canary/docs/components/layouts/productsBody.js"
      />
    </div>
  );
}
