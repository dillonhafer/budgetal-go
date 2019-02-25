import React, { Component } from 'react';

import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';
import SignInForm from './SignInForm';
import { Text, Button, Pane, Dialog } from 'evergreen-ui';

class SignIn extends Component {
  state = {
    visible: false,
    activeTab: '2',
    title: 'Sign In',
  };

  openModal = () => {
    this.setState({ activeTab: '2', title: 'Sign In', visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  forgotPassword = e => {
    e.target.blur();
    this.setState({ activeTab: '1', title: 'Forgot Password' });
  };
  signIn = e => {
    e.target.blur();
    this.setState({ activeTab: '2', title: 'Sign In' });
  };
  register = e => {
    e.target.blur();
    this.setState({ activeTab: '3', title: 'Register' });
  };

  render() {
    const { activeTab, title } = this.state;
    return (
      <div>
        <Pane className="anchor" onClick={this.openModal}>
          <Text>Sign In</Text>
        </Pane>
        <Dialog
          width={350}
          isShown={this.state.visible}
          title={title}
          onCloseComplete={this.closeModal}
          preventBodyScrolling
          onCancel={this.closeModal}
          hasFooter={false}
        >
          <Pane>
            {activeTab === '1' && (
              <Pane>
                <PasswordResetForm closeModal={this.closeModal} />
                <Pane
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <Button
                    onClick={this.signIn}
                    iconAfter="chevron-right"
                    height={24}
                  >
                    Sign In
                  </Button>
                </Pane>
              </Pane>
            )}
            {activeTab === '2' && (
              <Pane>
                <SignInForm resetSignIn={this.props.resetSignIn} />
                <Pane
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                >
                  <Button
                    onClick={this.forgotPassword}
                    iconBefore="chevron-left"
                    height={24}
                  >
                    Forgot password
                  </Button>
                  <Button
                    onClick={this.register}
                    iconAfter="chevron-right"
                    height={24}
                  >
                    Register
                  </Button>
                </Pane>
              </Pane>
            )}
            {activeTab === '3' && (
              <Pane>
                <RegisterForm resetSignIn={this.props.resetSignIn} />
                <Button
                  onClick={this.signIn}
                  iconBefore="chevron-left"
                  height={24}
                >
                  Sign In
                </Button>
              </Pane>
            )}
          </Pane>
        </Dialog>
      </div>
    );
  }
}

export default SignIn;
