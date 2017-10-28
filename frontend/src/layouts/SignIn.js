import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import Tabs from 'antd/lib/tabs';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';
import SignInForm from './SignInForm';

const TabPane = Tabs.TabPane;

class SignIn extends Component {
  state = {
    visible: false,
    activeKey: '2',
    title: 'Sign In',
  };

  openModal = () => {
    this.setState({ activeKey: '2', title: 'Sign In', visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  forgotPassword = () => {
    this.setState({ activeKey: '1', title: 'Forgot Password' });
  };
  signIn = () => {
    this.setState({ activeKey: '2', title: 'Sign In' });
  };
  register = () => {
    this.setState({ activeKey: '3', title: 'Register' });
  };

  render() {
    const { activeKey, title } = this.state;
    return (
      <div onClick={this.openModal}>
        Sign In
        <Modal
          title={title}
          wrapClassName="vertical-center-modal sign-in-modal"
          footer={null}
          width={350}
          visible={this.state.visible}
          onCancel={this.closeModal}
        >
          <Tabs activeKey={activeKey} defaultActiveKey="2" size="small">
            <TabPane tab="Tab 1" key="1">
              <PasswordResetForm />
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
              <RegisterForm resetSignIn={this.props.resetSignIn} />
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
