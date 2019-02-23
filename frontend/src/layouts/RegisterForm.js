import React, { Component } from 'react';
import { RegisterRequest } from '@shared/api/users';
import { error, notice } from 'window';
import { SetAuthenticationToken, SetCurrentUser } from 'authentication';

import { Pane, Button, Spinner, TextInputField } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

const defaultValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
};

const signUpValidations = Yup.object().shape({
  email: Yup.string()
    .email('E-mail Address is invalid')
    .required('E-mail Address is required'),
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password')], "Password doesn't match confirmation")
    .required('Password Confirmation is required'),
});

class RegisterForm extends Component {
  handleSubmit = (values, { setSubmitting }) => {
    RegisterRequest(values)
      .then(resp => {
        if (resp.ok) {
          notice('Welcome to Budgetal!');
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
          autoComplete="username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          {...validationMessages(errors.email, touched.email)}
        />
        <TextInputField
          label="Password"
          name="password"
          autoComplete="new-password"
          type="password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          {...validationMessages(errors.password, touched.password)}
        />

        <TextInputField
          label="Password Confirmation"
          name="passwordConfirmation"
          autoComplete="new-password"
          type="password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.passwordConfirmation}
          {...validationMessages(
            errors.passwordConfirmation,
            touched.passwordConfirmation,
          )}
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
            {isSubmitting ? 'Loading...' : 'Register'}
          </Pane>
        </Button>
      </Form>
    );
  };

  // render() {
  //   return (
  //     <Form onSubmit={this.handleSubmit} className="register-form">
  //       <FormItem hasFeedback={true}>
  //         {getFieldDecorator('email', {
  //           rules: [
  //             { required: true, message: 'E-mail Address is required' },
  //             { pattern: /.+@.+/, message: 'E-mail Address is invalid' },
  //           ],
  //         })(
  //           <Input
  //             prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
  //             type="email"
  //             autoCorrect="off"
  //             autoCapitalize="off"
  //             spellCheck="false"
  //             autoComplete="username"
  //             placeholder="E-mail Address"
  //           />,
  //         )}
  //       </FormItem>
  //       <FormItem hasFeedback={true}>
  //         {getFieldDecorator('password', {
  //           rules: [{ required: true, message: 'Password is required' }],
  //         })(
  //           <Input
  //             prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
  //             type="password"
  //             autoComplete="new-password"
  //             placeholder="Password"
  //           />,
  //         )}
  //       </FormItem>
  //       <FormItem hasFeedback={true}>
  //         {getFieldDecorator('password-confirmation', {
  //           rules: [
  //             {
  //               required: true,
  //               message: 'Password Confirmation is required',
  //             },
  //             {
  //               validator: this.handleConfirmPassword,
  //               message: 'Password Confirmation does not match password',
  //             },
  //           ],
  //         })(
  //           <Input
  //             prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
  //             type="password"
  //             autoComplete="new-password"
  //             placeholder="Password Confirmation"
  //           />,
  //         )}
  //       </FormItem>
  //       <FormItem>
  //         <Button
  //           type="primary"
  //           htmlType="submit"
  //           className="sign-in-form-button"
  //           loading={loading}
  //         >
  //           Register
  //         </Button>
  //       </FormItem>
  //     </Form>
  //   );
  // }

  render() {
    return (
      <Formik
        initialValues={defaultValues}
        onSubmit={this.handleSubmit}
        validationSchema={signUpValidations}
        render={this.renderForm}
      />
    );
  }
}
export default RegisterForm;
