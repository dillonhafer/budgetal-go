import React from 'react';

// Components
import { Col, Form, Input } from 'antd';
import { Icon, Pane, Button, Spinner } from 'evergreen-ui';

// API
import { ChangePasswordRequest } from '@shared/api/users';

// Helpers
import { error, notice } from 'window';
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
          <Pane display="none">
            <Input
              type="email"
              name="email"
              autoComplete="username"
              defaultValue={user.email}
            />
          </Pane>
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
                addonBefore={<Icon icon="lock" />}
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
                addonBefore={<Icon icon="lock" />}
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
                addonBefore={<Icon icon="lock" />}
                autoComplete="current-password"
                type="password"
              />,
            )}
          </Form.Item>
          <Pane display="flex" flexDirection="column" alignItems="flex-end">
            <Button height={40} appearance="primary" disabled={loading}>
              {loading && <Spinner size={16} marginRight={8} />}
              Change Password
            </Button>
          </Pane>
        </Col>
      </Form>
    );
  }
}

export default Form.create()(ChangePasswordForm);
