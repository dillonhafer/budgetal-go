import React, {Component} from 'react';
import {Modal, Form, Icon, Input, Button} from 'antd';
import request from './request';
const FormItem = Form.Item;

class SignIn extends Component {
  state = {
    visible: false,
  };

  submitForm = async values => {
    try {
      const resp = await request.post('/sign-in', values);

      if (resp && resp.ok) {
        window.notice('You are now signed in');
        localStorage.setItem('_budgetal_session', resp.token);
        localStorage.setItem('_budgetal_user', JSON.stringify(resp.user));
        this.props.callback();
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.submitForm(values);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <a onClick={() => this.setState({visible: true})}>Sign In</a>
        <Modal
          title="Sign In"
          wrapClassName="vertical-center-modal"
          footer={null}
          width={350}
          visible={this.state.visible}
          onOk={() => this.setState({visible: false})}
          onCancel={() => this.setState({visible: false})}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {required: true, message: 'E-mail Address is required'},
                ],
              })(
                <Input
                  prefix={<Icon type="mail" style={{fontSize: 13}} />}
                  type="email"
                  placeholder="E-mail Address"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
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
              <p>
                <a className="login-form-forgot" href="">
                  Forgot password?
                </a>
              </p>
              <Button
                type="primary"
                htmlType="submit"
                className="sign-in-form-button"
              >
                Sign In
              </Button>
              <div>
                Or <a href="">register now!</a>
              </div>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(SignIn);
