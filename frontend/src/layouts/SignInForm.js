import React, { Component } from 'react';
import { SignInRequest } from '@shared/api/sessions';
import { notice, error } from 'window';
import { SetAuthenticationToken, SetCurrentUser } from 'authentication';

import { Pane, Button, Spinner, TextInputField } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

const defaultValues = {
  email: '',
  password: '',
};

const signInValidations = Yup.object().shape({
  email: Yup.string()
    .email('E-mail Address is invalid')
    .required('E-mail Address is required'),
  password: Yup.string().required('Password is required'),
});

class SignInForm extends Component {
  handleSubmit = (values, { setSubmitting }) => {
    SignInRequest(values)
      .then(resp => {
        if (resp.ok) {
          notice('You are now signed in');
          SetAuthenticationToken(resp.token);
          SetCurrentUser(resp.user);
          this.props.resetSignIn();
        } else {
          error(resp.error);
        }
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  renderForm = ({
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }) => {
    return (
      <Form onSubmit={handleSubmit}>
        <TextInputField
          label="E-mail Address"
          name="email"
          required
          autoFocus
          autoComplete="username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          {...validationMessages(errors.email, touched.email)}
        />
        <TextInputField
          label="Password"
          name="password"
          autoComplete="current-password"
          type="password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          {...validationMessages(errors.password, touched.password)}
        />

        <Button
          disabled={isSubmitting}
          height={40}
          type="submit"
          appearance="primary"
          width="100%"
          display="inline-block"
          textAlign="center"
          marginBottom={32}
        >
          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            {isSubmitting && <Spinner size={16} marginRight={8} />}
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </Pane>
        </Button>
      </Form>
    );
  };

  render() {
    return (
      <Formik
        initialValues={defaultValues}
        onSubmit={this.handleSubmit}
        validationSchema={signInValidations}
        render={this.renderForm}
      />
    );
  }
}

export default SignInForm;
