// @flow

import React from 'react';
import { Modal, Form, Radio, Select, Button } from 'antd';
import get from 'lodash/get';
import { withApollo } from 'react-apollo';
import {FormattedMessage, injectIntl} from 'react-intl';
import gql from 'graphql-tag';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

type Props = {
  form: Object,
  value: Array<Object>,
  selectedValue: Array<Object>,
  fileName: string,
  triggerModal: Function,
  fields: Array<Object>,
  client: any,
  intl: Object,
  title: string,
  visible: boolean,
  query: Object,
  keyName: string
}

const ALL = 'ALL';
const THIS_PAGE = 'THIS_PAGE';
const SELECTED = 'SElECTED';
const DOWNLOAD = 'DOWNLOAD';

// $FlowFixMe
@injectIntl
@withApollo
@Form.create()
export default class ExportModal extends React.Component<Props> {
  handleSubmit = (e: Event) => {
    e.preventDefault();
    const {
      form,
      value,
      selectedValue,
      fileName,
      triggerModal,
      fields,
      client,
      query
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const {exportData, exportFieldKeys, exportWay, keyName} = values;
        let getData = Promise.resolve([]);
        if (exportData === ALL) {
          // have to fetch data without pagination data
          const queries = query.getQueries(keyName).args;
          const variables = query.getVairables();
          delete variables[queries.first.substr(1)];
          delete variables[queries.after.substr(1)];
          delete variables[queries.last.substr(1)];
          delete variables[queries.before.substr(1)];
  
          getData = client.query({
            query: gql.toGQL(keyName),
            // remove pagination field
            variables
          })
        } else if (exportData === THIS_PAGE) {
          getData = Promise.resolve(value);
        } else if (exportData === SELECTED) {
          getData = Promise.resolve(selectedValue);
        }
        const fieldsData = fields.filter(field => exportFieldKeys.find(key => key === field.keyName));
        if (exportWay === DOWNLOAD) {
          getData.then((data: Array<Object>) => {
            const csv = genCSV(data, fieldsData);
            download(fileName, csv);
          })
        } else {
          // not support other exportWay for now
        }
      }
    });
    triggerModal();
  }

  handleCancel = () => {
    this.props.triggerModal();
  }

  render() {
    const {selectedValue, visible, fields, form: {getFieldDecorator}, title, intl} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <Modal
        title={<FormattedMessage id="actions.export.modal.title" />}
        visible={visible}
        footer={null}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="actions.export.data.label" />}
          >
            {getFieldDecorator('exportData', {
              initialValue: selectedValue.length ? 'SELECTED' : 'ALL',
            })(
              <RadioGroup>
                <Radio value={ALL}>
                  <FormattedMessage id="actions.export.data.all" />
                  {title}
                </Radio>
                <Radio value={THIS_PAGE}>
                  <FormattedMessage id="actions.export.data.thisPage" />
                </Radio>
                <Radio value="SELECTED" disabled={!selectedValue.length}>
                  <FormattedMessage
                    id="actions.export.data.selected"
                    values={{
                      length: selectedValue.length,
                      title
                    }}
                  />
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          
          <FormItem
            {...formItemLayout}
            label={
              <FormattedMessage id="actions.exprot.way.label" />
            }
          >
            {getFieldDecorator('exportWay', {
              initialValue: DOWNLOAD,
            })(
              <RadioGroup disabled={true}>
                <Radio value={DOWNLOAD}>
                  <FormattedMessage id="actions.export.way.csv" />
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <FormattedMessage id="actions.export.fields.label" />
            }
          >
            {getFieldDecorator('exportFieldKeys', {
              initialValue: fields.map(field => field.keyName),
            })(
              <Select
                mode="multiple"
                placeholder={intl.formatMessage({
                  id: "actions.export.fields.placeholder"
                })}
              >
                {
                  fields.map(field => (
                    <Option value={field.keyName} key={field.keyName}>{field.title || field.keyName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 5 }}
          >
            <Button htmlType="button" onClick={this.handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 24 }}>匯出</Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

function genCSV(data: Array<Object>, fields: Array<Object>) {
  const fieldNames = fields.map(field => field.title || field.keyName);
  const rows = [fieldNames];
  data.forEach((datum) => {
    const values = [];
    fields.forEach((field) => {
      let value = get(datum, field.keyName);
      if (field.render) {
        value = field.render(value);
      }
      values.push(value);
    });
    rows.push(values);
  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach((rowArray) => {
    const row = rowArray.join(',');
    csvContent += `${row}\r\n`;
  });
  return csvContent;
}

function download(fileName, csvContent) {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileName}.csv`);
  link.innerHTML = '';
  document.body && document.body.appendChild(link); // Required for FF

  link.click();
}
