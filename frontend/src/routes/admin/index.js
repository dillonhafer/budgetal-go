import React, { Component } from 'react';
import { title, notice, error } from 'window';

import {
  AdminUsersRequest,
  AdminTestEmailRequest,
  AdminErrorRequest,
  AdminTestPushNotificationRequest,
} from 'api/admin';
import moment from 'moment';

// Antd
import { Card, Button, Table, Modal, Input } from 'antd';

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

  testPushNotification = async () => {
    this.setState({ pushNotificationLoading: true });
    try {
      const title = document.getElementsByName('pnTitle')[0].value;
      const body = document.getElementsByName('pnBody')[0].value;

      const resp = await AdminTestPushNotificationRequest({ title, body });
      if (resp && resp.ok) {
        notice('Sent Push Notification');
      } else {
        error('Could not send Push Notification');
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        pushNotificationLoading: false,
        pushNotificationVisible: false,
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

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Last Sign In',
      dataIndex: 'last_sign_in',
      key: 'last_sign_in',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '#',
      dataIndex: 'sign_in_count',
      key: 'sign_in_count',
    },
  ];

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

  dataSource(users) {
    return users.map((user, key) => {
      return {
        key: `user-key-${user.email}`,
        name: (
          <span>
            <img
              className={'nav-user-logo'}
              src={user.avatarUrl}
              alt={`${user.firstName} ${user.lastName}`}
            />
            {user.firstName || '-'}, <b>{user.lastName || '-'}</b>
          </span>
        ),
        email: user.email,
        last_sign_in: moment(user.lastSignIn).format(
          'MMMM DD, YYYY - h:mm:ss a',
        ),
        ip: user.ip,
        sign_in_count: user.signInCount,
      };
    });
  }

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
      <div>
        <h1>Admin Panel</h1>
        <Card noHovering title={'Config'}>
          <Button
            icon="mail"
            type="primary"
            loading={testEmailLoading}
            size="large"
            onClick={this.sendTestEmail}
          >
            {testEmailLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
          &nbsp;
          <Button
            icon="exception"
            type="danger"
            loading={errorLoading}
            size="large"
            onClick={this.sendErrorTest}
          >
            {errorLoading ? 'Loading...' : 'Test 500'}
          </Button>
          &nbsp;
          <Button
            icon="shake"
            type="primary"
            size="large"
            onClick={() => this.setState({ pushNotificationVisible: true })}
          >
            Test Push Notification
          </Button>
          <Modal
            title="Test Push Notification"
            okText="Send Notification"
            width={300}
            confirmLoading={pushNotificationLoading}
            visible={this.state.pushNotificationVisible}
            onOk={this.testPushNotification}
            onCancel={() => this.setState({ pushNotificationVisible: false })}
          >
            <form>
              <label>Title</label>
              <Input name="pnTitle" />
              <label>Body</label>
              <Input name="pnBody" />
            </form>
          </Modal>
        </Card>
        <br />
        <Card noHovering title={'Users'}>
          <Table
            dataSource={this.dataSource(this.state.users)}
            pagination={false}
            columns={this.columns}
            bordered
          />
        </Card>
      </div>
    );
  }
}
