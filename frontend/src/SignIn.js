import React, {Component} from 'react';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';

import {SignInRequest} from 'api';
import {SetAuthenticationToken, SetCurrentUser} from 'authentication';

const FormItem = Form.Item;

class SignIn extends Component {
  state = {
    visible: false,
  };

  submitForm = async values => {
    try {
      const resp = await SignInRequest(values);

      if (resp && resp.ok) {
        window.notice('You are now signed in');
        SetAuthenticationToken(resp.token);
        SetCurrentUser(resp.user);
        this.props.resetSignIn();
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
      <div onClick={() => this.setState({visible: true})}>
        Sign In
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
