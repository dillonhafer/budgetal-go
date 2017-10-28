import React, { Component } from 'react';

import { PasswordResetRequest } from 'api/users';

// Antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import { notice } from 'window';

const FormItem = Form.Item;

class PasswordResetForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        PasswordResetRequest(values);
        this.props.form.resetFields();
        notice(
          'We sent you an email with instructions on resetting your password',
        );
        document.querySelector('.ant-modal-close-x').click();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        name="resetPassword"
        className="reset-password"
      >
        <FormItem hasFeedback={true}>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: 'E-mail Address is required' },
              { pattern: /.+@.+/, message: 'E-mail Address is invalid' },
            ],
          })(
            <Input
              prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
              type="email"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="E-mail Address"
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="sign-in-form-button"
          >
            Request Password Reset
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(PasswordResetForm);
