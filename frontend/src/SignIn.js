import React, {Component} from 'react';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Tabs from 'antd/lib/tabs';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import {SignInRequest} from 'api';
import {SetAuthenticationToken, SetCurrentUser} from 'authentication';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class ForgotPasswordFields extends Component {
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
const ForgotPasswordForm = Form.create()(ForgotPasswordFields);

class SignInFields extends Component {
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
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
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
          <Button
            type="primary"
            htmlType="submit"
            className="sign-in-form-button"
          >
            Sign In
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const SignInForm = Form.create()(SignInFields);

class RegisterFields extends Component {
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
const RegisterForm = Form.create()(RegisterFields);

class SignIn extends Component {
  state = {
    visible: false,
    activeKey: '2',
    title: 'Sign In',
  };

  forgotPassword = () => {
    this.setState({activeKey: '1', title: 'Forgot Password'});
  };
  signIn = () => {
    this.setState({activeKey: '2', title: 'Sign In'});
  };
  register = () => {
    this.setState({activeKey: '3', title: 'Register'});
  };

  render() {
    const {activeKey, title} = this.state;
    return (
      <div onClick={() => this.setState({visible: true})}>
        Sign In
        <Modal
          title={title}
          wrapClassName="vertical-center-modal sign-in-modal"
          footer={null}
          width={350}
          visible={this.state.visible}
          onOk={() => this.setState({visible: false})}
          onCancel={() => this.setState({visible: false})}
        >
          <Tabs activeKey={activeKey} defaultActiveKey="2" size="small">
            <TabPane tab="Tab 1" key="1">
              <ForgotPasswordForm />
              <Row>
                <Col span={24} className="text-right">
                  <a onClick={this.signIn} className="sign-in-form-sign-up">
                    Sign In <Icon type="right" />
                  </a>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Tab 2" key="2">
              <SignInForm resetSignIn={this.props.resetSignIn} />
              <Row>
                <Col span={12}>
                  <a
                    onClick={this.forgotPassword}
                    className="sign-sin-form-forgot"
                  >
                    <Icon type="left" /> Forgot password
                  </a>
                </Col>
                <Col span={12} className="text-right">
                  <a onClick={this.register} className="sign-in-form-sign-up">
                    Register <Icon type="right" />
                  </a>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              <RegisterForm />
              <Row>
                <Col span={24}>
                  <a onClick={this.signIn} className="sign-sin-form-forgot">
                    <Icon type="left" /> Sign In
                  </a>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default SignIn;
