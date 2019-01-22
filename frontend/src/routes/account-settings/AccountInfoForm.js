import React, { PureComponent } from 'react';

// API
import { UpdateAccountInfoRequest } from '@shared/api/users';

// Components
import { Avatar, Button, Dialog, Pane, TextInputField } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';

// Helpers
import { notice, error } from 'window';
import { GetCurrentUser } from 'authentication';
import { round, assign } from 'lodash';
import { SetCurrentUser } from 'authentication';

import { Formik } from 'formik';
import * as Yup from 'yup';
import './image.css';

const accountInfoValidations = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email(),
  currentPassword: Yup.string().required('Your Current Password is required'),
});

const ProfileImage = ({ user, onClick }) => {
  let src = { src: '/missing-profile.png' };

  if (user.avatarUrl) {
    src.src = user.avatarUrl;
  }

  if (user.avatarUrl.slice(0, 4) !== 'data') {
    if (process.env.NODE_ENV === 'development' && user.avatarUrl) {
      src.src = new URL(user.avatarUrl).pathname;
    }

    if (/.*missing-profile.*/.test(src)) {
      src = {};
    }
  }

  return (
    <Avatar
      cursor="pointer"
      onClick={onClick}
      {...src}
      name={`${user.firstName || '?'} ${user.lastName || '?'}`}
      size={160}
    />
  );
};

class AccountInfoForm extends PureComponent {
  state = {
    user: { ...GetCurrentUser(), currentPassword: '' },
    loading: false,
    confirmPasswordVisible: false,
  };

  handleCancel = () => {
    this.setState({
      confirmPasswordVisible: false,
    });
  };

  handleChange = e => {
    if (e.target.files.length > 0) {
      this.handleFile(e.target.files[0]);
    }
  };

  handleFile = file => {
    this.setState({ file });
    const reader = new FileReader();
    const mbLimit = 5;

    if (round(file.size / 1048576, 2) > mbLimit) {
      error(`Your photo is too large. The limit is ${mbLimit} MB`);
    } else {
      reader.onload = upload => {
        const user = assign({}, this.state.user, {
          avatarUrl: upload.target.result,
        });
        this.setState({ user });
      };

      reader.readAsDataURL(file);
    }
  };

  handleSubmit = (
    values,
    { setSubmitting, resetForm, setTouched, setValues },
  ) => {
    setSubmitting(true);
    return this.save(values, setSubmitting)
      .then(this.handleCancel)
      .then(() => {
        setTouched({ currentPassword: false });
        setValues({ ...this.state.user, currentPassword: '' });
      });
  };

  save = async (values, setSubmitting) => {
    let data = new FormData();
    data.append('firstName', values.firstName);
    data.append('lastName', values.lastName);
    data.append('email', values.email);
    data.append('password', values.currentPassword);

    if (this.state.file) {
      data.append('avatar', this.state.file);
    }

    return UpdateAccountInfoRequest(data)
      .then(resp => {
        if (resp.ok) {
          notice('Account Updated');
          this.setState({ user: { ...this.state.user, ...resp.user } });
          SetCurrentUser(resp.user);
        } else {
          error(resp.error);
        }
        setSubmitting(false);
      })
      .catch(() => {
        error('Something went wrong');
        setSubmitting(false);
      });
  };

  confirmPassword = () => {
    this.setState({ confirmPasswordVisible: true });
  };

  renderForm = ({
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    setSubmitting,
    handleSubmit,
    setValues,
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
          label="First Name"
          name="firstName"
          autoComplete="given-name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.firstName}
          {...validationMessages(errors.firstName, touched.firstName)}
        />
        <TextInputField
          label="Last Name"
          name="lastName"
          autoComplete="family-name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.lastName}
          {...validationMessages(errors.lastName, touched.lastName)}
        />
        <TextInputField
          label="Email"
          name="email"
          autoComplete="username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          required
          {...validationMessages(errors.email, touched.email)}
        />
        <Dialog
          preventBodyScrolling
          isShown={this.state.confirmPasswordVisible}
          title="Confirm Password"
          width={300}
          isConfirmLoading={isSubmitting}
          cancelText="Close"
          onConfirm={handleSubmit}
          onCloseComplete={this.handleCancel}
          confirmLabel={isSubmitting ? 'Loading...' : 'Confirm Password'}
        >
          <Form onSubmit={handleSubmit}>
            <Pane display="none">
              <input
                type="email"
                autoComplete="username"
                defaultValue={values.email}
              />
            </Pane>
            <TextInputField
              autoFocus
              label="Current Password"
              id="currentPassword"
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
          </Form>
        </Dialog>

        <Pane display="flex" flexDirection="column" alignItems="flex-end">
          <Button
            height={40}
            type="button"
            onClick={this.confirmPassword}
            appearance="primary"
          >
            Update Account Info
          </Button>
        </Pane>
      </Form>
    );
  };

  render() {
    return (
      <Pane>
        <Pane display="flex" flexDirection="row">
          <Pane
            marginRight={32}
            display="flex"
            flexDirection="column"
            width={200}
            alignItems="center"
          >
            <Pane display="none">
              <input
                ref={f => (this.fileField = f)}
                type="file"
                onChange={this.handleChange}
              />
            </Pane>
            <ProfileImage
              onClick={() => {
                this.fileField.click();
              }}
              user={this.state.user}
            />
          </Pane>
          <Pane flex="1" flexDirection="column">
            <Formik
              initialValues={this.state.user}
              onSubmit={this.handleSubmit}
              validationSchema={accountInfoValidations}
              render={this.renderForm}
            />
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default AccountInfoForm;
