import React, {Component} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

const FormItem = Form.Item;

class RegisterForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('register-email', {
            rules: [{required: true, message: 'E-mail Address is required'}],
          })(
            <Input
              prefix={<Icon type="mail" style={{fontSize: 13}} />}
              type="email"
              placeholder="E-mail Address"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('register-password', {
            rules: [{required: true, message: 'Password is required'}],
          })(
            <Input
              prefix={<Icon type="lock" style={{fontSize: 13}} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('register-password-confirmation', {
            rules: [
              {
                required: true,
                message: 'Password Confirmation is required',
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{fontSize: 13}} />}
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
          >
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(RegisterForm);
