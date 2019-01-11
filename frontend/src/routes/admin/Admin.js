import React, { Component } from 'react';
import { title, notice, error } from 'window';

import {
  AdminUsersRequest,
  AdminTestEmailRequest,
  AdminErrorRequest,
  AdminTestPushNotificationRequest,
} from '@shared/api/admin';
import moment from 'moment';

import {
  Avatar,
  Button,
  Dialog,
  Heading,
  Pane,
  Table,
  TextInputField,
} from 'evergreen-ui';

export default class Admin extends Component {
  state = {
    isAdmin: false,
    testEmailLoading: false,
    errorLoading: false,
    pushNotificationLoading: false,
    pushNotificationVisible: false,
    users: [],
  };

  componentDidMount() {
    this.checkForAdmin();
  }

  testPushNotification = async e => {
    e.preventDefault();
    const titleField = document.getElementsByName('pnTitle')[0];
    const bodyField = document.getElementsByName('pnBody')[0];
    this.setState({ pushNotificationLoading: true });
    try {
      const title = titleField.value;
      const body = bodyField.value;

      const resp = await AdminTestPushNotificationRequest({ title, body });
      if (resp && resp.ok) {
        notice('Sent Push Notification');
        this.setState({
          pushNotificationVisible: false,
        });
        titleField.value = '';
        bodyField.value = '';
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        pushNotificationLoading: false,
      });
    }
  };

  sendTestEmail = async () => {
    this.setState({ testEmailLoading: true });
    try {
      const resp = await AdminTestEmailRequest();
      if (resp && resp.ok) {
        notice('Test email has been sent');
      } else {
        error('Could not send test email');
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ testEmailLoading: false });
    }
  };

  sendErrorTest = async () => {
    this.setState({ errorLoading: true });
    try {
      await AdminErrorRequest();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ errorLoading: false });
    }
  };

  checkForAdmin = async () => {
    const resp = await AdminUsersRequest();
    const isAdmin = resp && resp.ok && resp.users.length;
    if (isAdmin) {
      title(`Admin`);
      this.setState({
        isAdmin,
        users: resp.users,
      });
    } else {
      this.props.history.replace('404');
    }
  };

  render() {
    const {
      isAdmin,
      testEmailLoading,
      errorLoading,
      pushNotificationLoading,
    } = this.state;
    if (!isAdmin) {
      return null;
    }

    return (
      <Pane>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={16}
        >
          <Heading size={800}>ADMIN PANEL</Heading>
        </Pane>
        <Pane
          display="flex"
          padding={16}
          marginBottom={8}
          background="tint2"
          borderRadius={3}
        >
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>TEST CONFIG</Heading>
          </Pane>
        </Pane>
        <Pane>
          <Button
            height={40}
            iconBefore="envelope"
            appearance="primary"
            intent="none"
            disabled={testEmailLoading}
            onClick={this.sendTestEmail}
          >
            {testEmailLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
          &nbsp;
          <Button
            height={40}
            iconBefore="error"
            appearance="primary"
            intent="danger"
            disabled={errorLoading}
            onClick={this.sendErrorTest}
          >
            {errorLoading ? 'Loading...' : 'Test 500'}
          </Button>
          &nbsp;
          <Button
            height={40}
            iconBefore="notifications"
            appearance="primary"
            intent="none"
            onClick={() => this.setState({ pushNotificationVisible: true })}
          >
            Test Push Notification
          </Button>
          <Dialog
            preventBodyScrolling
            isShown={this.state.pushNotificationVisible}
            title="Test Push Notification"
            width={350}
            onCloseComplete={() => {
              this.setState({ pushNotificationVisible: false });
            }}
            confirmLoading={pushNotificationLoading}
            cancelText="Cancel"
            onConfirm={this.testPushNotification}
            confirmLabel={
              pushNotificationLoading ? 'Loading...' : 'Send Notification'
            }
          >
            <form onSubmit={this.testPushNotification}>
              <TextInputField required label="Title" name="pnTitle" />
              <TextInputField required label="Body" name="pnBody" />
              <input type="submit" className="hide" value="Submit" />
            </form>
          </Dialog>
        </Pane>

        <Pane height="48px" />

        <Pane
          display="flex"
          padding={16}
          marginBottom={8}
          background="tint2"
          borderRadius={3}
        >
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>USERS</Heading>
          </Pane>
        </Pane>
        <Table>
          <Table.Head accountForScrollbar>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Email</Table.TextHeaderCell>
            <Table.TextHeaderCell>Last Sign In</Table.TextHeaderCell>
            <Table.TextHeaderCell>IP</Table.TextHeaderCell>
            <Table.TextHeaderCell>#</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {this.state.users.map(user => (
              <Table.Row key={`${user.email}`}>
                <Table.TextCell>
                  <Pane display="flex" alignItems="center" flexDirection="row">
                    <Avatar
                      {...(/.*missing-profile.*/.test(user.avatarUrl)
                        ? {}
                        : { src: user.avatarUrl })}
                      name={`${user.firstName || '?'} ${user.lastName || '?'}`}
                      size={40}
                      marginRight={16}
                    />
                    <span>
                      {user.firstName || '-'}, <b>{user.lastName || '-'}</b>
                    </span>
                  </Pane>
                </Table.TextCell>
                <Table.TextCell>{user.email}</Table.TextCell>
                <Table.TextCell>
                  {moment(user.lastSignIn).format('MMMM DD, YYYY - h:mm:ss a')}
                </Table.TextCell>
                <Table.TextCell isNumber>{user.ip}</Table.TextCell>
                <Table.TextCell isNumber>{user.signInCount}</Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
    );
  }
}
