import React, { Component } from 'react';
import { title, scrollTop } from 'window';

import { AdminUsersRequest } from 'api/admin';
import moment from 'moment';

// Antd
import { Table } from 'antd';

export default class Admin extends Component {
  state = {
    isAdmin: false,
    users: [],
  };
  componentDidMount() {
    this.checkForAdmin();
  }

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
      scrollTop();
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
            {user.firstName}, <b>{user.lastName}</b>
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
    const { isAdmin } = this.state;
    if (!isAdmin) {
      return null;
    }

    return (
      <div>
        <h1>Admin Panel</h1>
        <Table
          dataSource={this.dataSource(this.state.users)}
          pagination={false}
          columns={this.columns}
          bordered
        />
      </div>
    );
  }
}
