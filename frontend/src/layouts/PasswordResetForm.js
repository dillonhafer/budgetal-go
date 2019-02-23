import React, { Component } from 'react';

// API
import { PasswordResetRequest } from '@shared/api/users';

// Helpers
import { notice } from 'window';

// Components
import { Pane, Button, Spinner, TextInputField } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

const defaultValues = {
  email: '',
};
const passwordResetValidation = Yup.object().shape({
  email: Yup.string()
    .email('E-mail Address is invalid')
    .required('E-mail Address is required'),
});

class PasswordResetForm extends Component {
  handleSubmit = (values, { setSubmitting, resetForm }) => {
    PasswordResetRequest(values)
      .then(() => {
        setSubmitting(false);
        resetForm();
        notice(
          'We sent you an email with instructions on resetting your password',
        );
        this.props.closeModal();
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
          autoComplete="username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          {...validationMessages(errors.email, touched.email)}
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
            {isSubmitting ? 'Loading...' : 'Request Password Reset'}
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
        validationSchema={passwordResetValidation}
        render={this.renderForm}
      />
    );
  }
}

export default PasswordResetForm;
