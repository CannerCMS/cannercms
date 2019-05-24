// @flow

import React from 'react';
import {
  Modal, Form, Radio, Select, Button,
} from 'antd';
import get from 'lodash/get';
import { withApollo } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
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

type State = {
  downloading: boolean
}

const ALL = 'ALL';
const THIS_PAGE = 'THIS_PAGE';
const SELECTED = 'SElECTED';
const DOWNLOAD = 'DOWNLOAD';

// $FlowFixMe
@injectIntl
// $FlowFixMe
@withApollo
// $FlowFixMe
@Form.create()
export default class ExportModal extends React.Component<Props, State> {
  state = {
    downloading: false,
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      form,
      value,
      selectedValue,
      fileName,
      triggerModal,
      fields,
      client,
      query,
      keyName,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { exportData, exportFieldKeys, exportWay } = values;
        let getData = Promise.resolve([]);
        if (exportData === ALL) {
          // have to fetch data without pagination data
          const queries = query.getQueries([keyName]).args;
          const variables = query.getVariables();
          delete variables[queries.first.substr(1)];
          delete variables[queries.after.substr(1)];
          delete variables[queries.last.substr(1)];
          delete variables[queries.before.substr(1)];

          getData = client.query({
            query: gql`${query.toGQL(keyName)}`,
            // remove pagination field
            variables,
          }).then(result => result.data[keyName].edges.map(edge => edge.node));
        } else if (exportData === THIS_PAGE) {
          getData = Promise.resolve(value);
        } else if (exportData === SELECTED) {
          getData = Promise.resolve(selectedValue);
        }
        const fieldsData = fields.filter(field => exportFieldKeys.find(key => key === field.keyName));
        if (exportWay === DOWNLOAD) {
          this.setState({
            downloading: true,
          });
          getData
            .then((data: Array<Object>) => {
              const csv = genCSV(data, fieldsData);
              download(fileName, csv);
            }).then(() => {
              this.setState({
                downloading: false,
              }, triggerModal);
            });
        } else {
          // not support other exportWay for now
        }
      }
    });
  }

  handleCancel = () => {
    this.props.triggerModal();
  }

  render() {
    const {
      selectedValue, visible, fields, form: { getFieldDecorator }, title, intl,
    } = this.props;
    const { downloading } = this.state;
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
        closable
        maskClosable
        onCancel={this.handleCancel}
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
                <Radio value={ALL} data-testid="actions-export-data-all">
                  <FormattedMessage id="actions.export.data.all" />
                  {title}
                </Radio>
                <Radio value={THIS_PAGE} data-testid="actions-export-data-this-page">
                  <FormattedMessage id="actions.export.data.thisPage" />
                </Radio>
                <Radio value="SELECTED" disabled={!selectedValue.length} data-testid="actions-export-data-selected">
                  <FormattedMessage
                    id="actions.export.data.selected"
                    values={{
                      length: selectedValue.length,
                      title,
                    }}
                  />
                </Radio>
              </RadioGroup>,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <FormattedMessage id="actions.export.way.label" />
            }
          >
            {getFieldDecorator('exportWay', {
              initialValue: DOWNLOAD,
            })(
              <RadioGroup disabled>
                <Radio value={DOWNLOAD} data-testid="actions-export-way-csv">
                  <FormattedMessage id="actions.export.way.csv" />
                </Radio>
              </RadioGroup>,
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
                  id: 'actions.export.fields.placeholder',
                })}
                data-testid="actions-export-fields-select"
              >
                {
                  fields.map((field, index) => (
                    <Option data-testid={`actions-export-fields-option-${index}`} value={field.keyName} key={field.keyName}>{field.title || field.keyName}</Option>
                  ))
                }
              </Select>,
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 5 }}
          >
            <Button data-testid="actions-export-cancel-button" htmlType="button" onClick={this.handleCancel}>
              <FormattedMessage id="actions.export.modal.cancelButton" />
            </Button>
            <Button data-testid="actions-export-confirm-button" loading={downloading} type="primary" htmlType="submit" style={{ marginLeft: 24 }}>
              <FormattedMessage id="actions.export.modal.confirmButton" />
            </Button>
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
      if (Array.isArray(value)) {
        value = value.join(';');
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
