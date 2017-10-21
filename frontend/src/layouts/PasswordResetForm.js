import React, {Component} from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

const FormItem = Form.Item;

class PasswordResetForm extends Component {
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
          {getFieldDecorator('reset-email', {
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
