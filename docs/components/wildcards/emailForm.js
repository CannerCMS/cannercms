import React from 'react';
import {Form, Alert, Input, Button, notification} from 'antd';
import {get} from 'lodash';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
export default class EmailForm extends React.Component {
  state = {
    loading: false
  };

  constructor(props) {
    super(props);
    this.record = get(props.rootValue, props.refId.getPathArr().slice(0, -1), {});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.triggerLoading();
        setTimeout(() => {
          // eslint-disable-next-line
          console.log('get value', values);
          this.triggerLoading();
          notification.success({
            message: `Sent Email to ${this.record.name} Successfully!`
          })
        }, 3000);
      }
    });
  }

  triggerLoading = () => {
    this.setState({
      loading: !this.state.loading
    });
  }

  render() {
    const {form: {getFieldDecorator}} = this.props;
    const {loading} = this.state;
    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <FormItem >
          <Alert
            message={`Send Email to ${this.record.name}`}
            description={
              <div>
                You can use <b>&lt;component&gt;</b> tag to insert any component you want in your component tree without changing the schema.
                See <a href="https://github.com/Canner/canner/blob/canary/docs/schema/customers.schema.js" target="_blank" rel="noopener noreferrer">the schema</a> to learn more.
              </div>
            }
          />
        </FormItem>
        <FormItem
          label="Title"
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: 'Please input the title of this Email!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="Content"
        >
          {getFieldDecorator('content', {
            rules: [{
              required: true, message: 'Please input the content of this Email!',
            }],
          })(
            <TextArea />
          )}
        </FormItem>
        <FormItem >
          <Button type="primary" htmlType="submit" loading={loading} >Send</Button>
        </FormItem>
      </Form>
    );
  }
}
