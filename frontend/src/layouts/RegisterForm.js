import React, { Component } from 'react';
import { RegisterRequest } from 'api/users';
import { notice } from 'window';
import { SetAuthenticationToken, SetCurrentUser } from 'authentication';

import { Form, Input, Button, Icon } from 'antd';

const FormItem = Form.Item;

class RegisterForm extends Component {
  state = {
    loading: false,
  };

  submitForm = async user => {
    this.setState({ loading: true });
    try {
      const resp = await RegisterRequest(user);

      if (resp && resp.ok) {
        notice('Welcome to Budgetal!');
        SetAuthenticationToken(resp.token);
        SetCurrentUser(resp.user);
        this.props.resetSignIn();
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, user) => {
      if (!err) {
        this.submitForm(user);
      }
    });
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback("Passwords don't match");
    }
    callback();
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="register-form">
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
              autoCapitalize="off"
              spellcheck="false"
              placeholder="E-mail Address"
            />,
          )}
        </FormItem>
        <FormItem hasFeedback={true}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Password is required' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>
        <FormItem hasFeedback={true}>
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
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="sign-in-form-button"
            loading={loading}
          >
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(RegisterForm);
