import React, { Component } from 'react';

import { Modal, Icon, Tabs, Row, Col } from 'antd';

import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';
import SignInForm from './SignInForm';
import { colors } from '@shared/theme';

const TabPane = Tabs.TabPane;

const styles = {
  anchor: {
    border: 'none',
    background: 'none',
    outline: 'none',
    color: colors.primary,
    cursor: 'pointer',
  },
};

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
                  <button
                    onClick={this.signIn}
                    style={styles.anchor}
                    className="sign-in-form-sign-up"
                  >
                    Sign In <Icon type="right" />
                  </button>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Tab 2" key="2">
              <SignInForm resetSignIn={this.props.resetSignIn} />
              <Row>
                <Col span={12}>
                  <button
                    style={styles.anchor}
                    onClick={this.forgotPassword}
                    className="sign-sin-form-forgot"
                  >
                    <Icon type="left" /> Forgot password
                  </button>
                </Col>
                <Col span={12} className="text-right">
                  <button
                    onClick={this.register}
                    style={styles.anchor}
                    className="sign-in-form-sign-up"
                  >
                    Register <Icon type="right" />
                  </button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              <RegisterForm resetSignIn={this.props.resetSignIn} />
              <Row>
                <Col span={24}>
                  <button
                    style={styles.anchor}
                    onClick={this.signIn}
                    className="sign-sin-form-forgot"
                  >
                    <Icon type="left" /> Sign In
                  </button>
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
