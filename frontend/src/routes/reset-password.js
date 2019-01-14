import React, { Component } from 'react';
import { notice, error } from 'window';
import { ResetPasswordRequest } from '@shared/api/users';
import { TextInputField, Pane, Heading, Button } from 'evergreen-ui';

class ResetPassword extends Component {
  state = {
    password: '',
    passwordConfirmation: '',
  };

  submitForm = async password => {
    try {
      let params = { reset_password_token: '' };
      try {
        params = window.location.search
          .substring(1)
          .split('&')
          .reduce((acc, p) => {
            const param = p.split('=');
            return { ...acc, [param[0]]: param[1] };
          }, {});
      } catch (err) {}

      const resp = await ResetPasswordRequest({
        password,
        reset_password_token: params.reset_password_token,
      });

      if (resp && resp.ok) {
        notice('Your password has been updated');
        document.querySelector('.logo').click();
      } else {
        error('The link in your email may have expired.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  valid = () => {
    return (
      this.state.password.length > 5 &&
      this.state.password === this.state.passwordConfirmation
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.valid()) {
      this.submitForm(this.state.password);
    } else {
      error('Form is invalid');
    }
  };

  render() {
    return (
      <Pane>
        <Heading size={800}>CHANGE YOUR PASSWORD</Heading>
        <Pane marginTop={16} width={300}>
          <form onSubmit={this.handleSubmit}>
            <TextInputField
              label="Password"
              placeholder="Password"
              type="password"
              onChange={({ target: { value: password } }) => {
                this.setState({ password });
              }}
              value={this.state.password}
            />
            <TextInputField
              label="Password Confirmation"
              placeholder="Password Confirmation"
              type="password"
              value={this.state.passwordConfirmation}
              onChange={({ target: { value: passwordConfirmation } }) => {
                this.setState({ passwordConfirmation });
              }}
            />
            <Button appearance="primary" height={40}>
              Change Password
            </Button>
          </form>
        </Pane>
      </Pane>
    );
  }
}

export default ResetPassword;
