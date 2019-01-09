import React, { Component } from 'react';
import { notice, error } from 'window';
import { ResetPasswordRequest } from '@shared/api/users';

import { Button, Icon, Form, Input } from 'antd';

class ResetPassword extends Component {
  submitForm = async password => {
    try {
      let params = { reset_password_token: '' };
      try {
        params = window.location.search
          .substring(1)
          .split('&')
          .reduce((acc, p) => {
            const param = p.split('=');
            return { ...acc, [param[0]]: param[1] };
          }, {});
      } catch (err) {}

      const resp = await ResetPasswordRequest({
        password,
        reset_password_token: params.reset_password_token,
      });

      if (resp && resp.ok) {
        notice('Your password has been updated');
        document.querySelector('.logo').click();
      } else {
        error('The link in your email may have expired.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback("Passwords don't match");
    }
    callback();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, user) => {
      if (!err) {
        this.submitForm(user.password);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h1>Change your password</h1>
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
          <Form.Item hasFeedback={true}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Password is required' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback={true}>
            {getFieldDecorator('password-confirmation', {
              rules: [
                {
                  required: true,
                  message: 'Password Confirmation is required',
                },
                {
                  validator: this.handleConfirmPassword,
                  message: 'Password Confirmation does not match password',
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="password"
                placeholder="Password Confirmation"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ResetPassword);
