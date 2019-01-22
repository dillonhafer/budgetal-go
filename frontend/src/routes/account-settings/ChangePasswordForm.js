import React, { Component } from 'react';

// Components
import { TextInputField, Pane, Button, Spinner } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';

// API
import { ChangePasswordRequest } from '@shared/api/users';

// Helpers
import { error, notice } from 'window';
import { GetCurrentUser } from 'authentication';

import { Formik } from 'formik';
import * as Yup from 'yup';

const changePasswordValidations = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password')], "Password doesn't match confirmation")
    .required('Password Confirmation is required'),
  currentPassword: Yup.string().required('Your Current Password is required'),
});

const initialValues = {
  password: '',
  passwordConfirmation: '',
  currentPassword: '',
};

class ChangePasswordForm extends Component {
  savePassword = async ({ password, currentPassword }, setSubmitting) => {
    setSubmitting(true);

    try {
      const resp = await ChangePasswordRequest({ password, currentPassword });
      if (resp && resp.ok) {
        notice(resp.message);
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  handleSubmit = (values, { setSubmitting, resetForm }) => {
    return this.savePassword(values, setSubmitting).then(resetForm);
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
    const user = GetCurrentUser();

    return (
      <Form onSubmit={handleSubmit}>
        <Pane display="none">
          <input
            type="email"
            name="email"
            autoComplete="username"
            defaultValue={user.email}
          />
        </Pane>
        <TextInputField
          label="New Password"
          name="password"
          required
          autoComplete="new-password"
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          {...validationMessages(errors.password, touched.password)}
        />
        <TextInputField
          required
          label="Password Confirmation"
          name="passwordConfirmation"
          autoComplete="new-password"
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.passwordConfirmation}
          {...validationMessages(
            errors.passwordConfirmation,
            touched.passwordConfirmation,
          )}
        />
        <TextInputField
          label="Current Password"
          name="currentPassword"
          autoComplete="current-password"
          type="password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.currentPassword}
          {...validationMessages(
            errors.currentPassword,
            touched.currentPassword,
          )}
        />
        <Pane display="flex" flexDirection="column" alignItems="flex-end">
          <Button height={40} appearance="primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={16} marginRight={8} />}
            Change Password
          </Button>
        </Pane>
      </Form>
    );
  };

  render() {
    return (
      <Pane width={350}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={changePasswordValidations}
          render={this.renderForm}
        />
      </Pane>
    );
  }
}

export default ChangePasswordForm;
