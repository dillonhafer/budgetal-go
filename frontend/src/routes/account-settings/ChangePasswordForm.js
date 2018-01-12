import React from 'react';
import { ChangePasswordRequest } from 'api/users';
import { error, notice } from 'window';
import { Button, Col, Form, Icon, Input } from 'antd';
import { GetCurrentUser } from 'authentication';

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

class ChangePasswordForm extends React.Component {
  state = {
    loading: false,
  };

  savePassword = async ({ password, currentPassword }) => {
    try {
      this.setState({ loading: true });
      const resp = await ChangePasswordRequest({ password, currentPassword });
      if (resp && resp.ok) {
        notice(resp.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.savePassword({
          password: values.password,
          currentPassword: values.currentPassword,
        });
        this.props.form.resetFields();
      } else {
        error('Please check form for errors');
      }
    });
  };

  checkPasswordConfirmation = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback("Passwords don't match");
    }
    callback();
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const user = GetCurrentUser();
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <Col span={24}>
          <Input type="hidden" autoComplete="username" value={user.email} />
          <Form.Item {...formItemLayout} label="New Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Password is required',
                },
              ],
            })(
              <Input
                addonBefore={<Icon type="lock" />}
                autoComplete="new-password"
                type="password"
              />,
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Password Confirmation"
            hasFeedback
          >
            {getFieldDecorator('password_confirmation', {
              rules: [
                {
                  required: true,
                  message: 'Password Confirmation is required',
                },
                {
                  validator: this.checkPasswordConfirmation,
                },
              ],
            })(
              <Input
                addonBefore={<Icon type="lock" />}
                autoComplete="new-password"
                type="password"
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="Current Password" hasFeedback>
            {getFieldDecorator('currentPassword', {
              rules: [
                {
                  required: true,
                  message: 'Current Password is required',
                },
              ],
            })(
              <Input
                addonBefore={<Icon type="lock" />}
                autoComplete="current-password"
                type="password"
              />,
            )}
          </Form.Item>
          <Col span={12} offset={12}>
            <Button
              type="primary"
              htmlType="submit"
              className="right"
              size="large"
              loading={loading}
            >
              Change Password
            </Button>
          </Col>
        </Col>
      </Form>
    );
  }
}

export default Form.create()(ChangePasswordForm);
