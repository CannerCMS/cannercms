// @flow

import React from 'react';
import {createEmptyData} from 'canner-helpers';
import { Alert, Modal, Form, Button, Upload, Icon } from 'antd';
import {
  get,
  set
} from 'lodash';
import { withApollo } from 'react-apollo';
import {FormattedMessage, injectIntl} from 'react-intl';

const Dragger = Upload.Dragger;

type Props = {
  form: Object,
  fileName: string,
  triggerModal: Function,
  fields: Array<Object>,
  client: any,
  intl: Object,
  title: string,
  visible: boolean,
  query: Object,
  keyName: string,
  items: Object,
  deploy: Function,
  request: Function
}

type State = {
  success: boolean,
  error: boolean,
  errorMessage: ?string,
  list: Array<Array<string>>
}

// $FlowFixMe
@injectIntl
@withApollo
@Form.create()
export default class ImportModal extends React.Component<Props, State> {
  state = {
    success: false,
    error: false,
    errorMessage: '',
    list: []
  };
  
  download = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const {
      fileName,
      triggerModal,
      fields,
    } = this.props;
    const csv = genCSV([], fields);
    download(fileName, csv);
    triggerModal();
  }
  
  handleCancel = () => {
    this.props.triggerModal();
  }
  
  customRequest = ({
    onSuccess,
    onError,
    file
  }: Object) => {
    const {deploy, keyName} = this.props;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csv = parseCSV(e.target.result, '\n', ',');
      this.setState({
        list: csv.slice(1)
      });
      this.request(csv)
        .then(() => deploy(keyName))
        .then(() => {
          onSuccess('done');
        })
        .catch(e => {
          onError(e);
        });
    };
  }

  request = (csv: Array<Array<string>>) => {
    const {request, fields, keyName, items, intl} = this.props;
    const fieldsLength = fields.length;
    return new Promise((resolve, reject) => {
      try {
        csv.slice(1).reduce((preRequest, values) => {
          const payload = fields.reduce((result, field, index) => {
            let value = values[index];
            if (field.type === 'number') {
              value = Number(value);
            } else if (field.type === 'boolean') {
              value = Boolean(value);
            }
            set(result, field.keyName, value);
            return result;
          }, {});
          if (values.length !== fieldsLength) {
            throw new Error(intl.formatMessage({
              id: 'actions.import.error.invalidFormat'
            }));
          }
          const tmpId = Math.random().toString(36).substr(2, 12);
          return preRequest.then(() => request({
            type: 'CREATE_ARRAY',
            payload: {
              key: keyName,
              id: tmpId,
              value: {...createEmptyData(items), ...payload, id: tmpId, __typename: null}
            }
          }).catch(e => e));
        }, Promise.resolve()).then(resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

  uploadChange = (info: Object) => {
    const {file} = info;
    if (file.status === 'done') {
      this.setState({
        success: true
      });
    } else if (file.status === 'error') {
      this.setState({
        success: false,
        error: true,
        errorMessage: file.error.message,
      });
    } else {
      this.setState({
        success: false,
        error: false
      });
    }
  }

  render() {
    const {visible, title, keyName } = this.props;
    const {success, list, error, errorMessage} = this.state;
    return (
      <Modal
        title={<FormattedMessage id="actions.import.modal.title" />}
        visible={visible}
        footer={null}
        closable
        maskClosable
        onCancel={this.handleCancel}
      >
        <React.Fragment>
          <div style={{marginBottom: 24}}>
            <FormattedMessage id="actions.import.step1" tagName="div" />
            <Button onClick={this.download} data-testid="actions-import-download-button">
              <Icon type="download" />
              <FormattedMessage id="actions.import.download" />
            </Button>
          </div>
          <FormattedMessage id="actions.import.step2" tagName="div" />
          <Dragger
            name="file"
            data-testid="actions-import-dragger"
            customRequest={this.customRequest}
            accept="text/csv"
            onChange={this.uploadChange}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <FormattedMessage id="actions.import.upload.hint">
              {text => (
                <p className="ant-upload-text">{text}</p>
              )}
            </FormattedMessage>
          </Dragger>
          {
            success && (
              <Alert
                message={
                  <FormattedMessage
                    id="actions.import.upload.success"
                    values={{
                      length: list.length,
                      title: title || keyName
                    }}
                  />
                }
                type="success"
              />
              
            )
          }
          {
            error && (
              <Alert
                message={errorMessage}
                type="error"
              />
              
            )
          }
        </React.Fragment>
      </Modal>
    );
  }
}

function parseCSV(text, lineTerminator, cellTerminator) {
  const rows = [];
  //break the lines apart
  var lines = text.split(lineTerminator);
  for(var j = 0; j<lines.length; j++){
    const values = [];
    if(lines[j] != ""){
      //create a table row 
      //split the rows at the cellTerminator character
      var information = lines[j].split(cellTerminator);
      for(var k = 0; k < information.length; k++){
        //append the cell to the row
        values.push(information[k]);
      }
    }
    rows.push(values);
  }
  return rows;
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
