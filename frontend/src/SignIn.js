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

class SignIn extends Component {
  state = {
    visible: false,
    activeKey: '2',
    title: 'Sign In',
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
    const {getFieldDecorator} = this.props.form;
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="sign-in-form-button"
                  >
                    Request Password Reset
                  </Button>
                </FormItem>
              </Form>
              <Row>
                <Col span={24} className="text-right">
                  <a onClick={this.signIn} className="sign-in-form-sign-up">
                    Sign In <Icon type="right" />
                  </a>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Tab 2" key="2">
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="sign-in-form-button"
                  >
                    Sign In
                  </Button>
                </FormItem>
              </Form>
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
                  {getFieldDecorator('password_confirmation', {
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

export default Form.create()(SignIn);
