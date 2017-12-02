import React, { Component } from 'react';
import { title, notice, error } from 'window';

import { AdminUsersRequest, AdminTestEmailRequest } from 'api/admin';
import moment from 'moment';

// Antd
import { Card, Button, Table } from 'antd';

export default class Admin extends Component {
  state = {
    isAdmin: false,
    testEmailLoading: false,
    users: [],
  };

  componentDidMount() {
    this.checkForAdmin();
  }

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
    const { isAdmin, testEmailLoading } = this.state;
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
