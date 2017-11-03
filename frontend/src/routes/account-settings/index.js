import React, { Component } from 'react';
import AccountInfoForm from './AccountInfoForm';
import ChangePasswordForm from './ChangePasswordForm';
import SessionsTable from './SessionsTable';

import { title, scrollTop } from 'window';
import { Icon, Row, Col, Card } from 'antd';
import { colors } from 'window';

class AccountSettings extends Component {
  componentDidMount() {
    title('Account Settings');
    scrollTop();
  }

  render() {
    const iconStyle = {
      background: colors.primary,
      color: 'white',
      borderRadius: '18px',
      padding: '4px',
    };
    const sessionsTitle = (
      <div>
        <Icon style={iconStyle} type="info" /> Sessions
      </div>
    );
    const infoTitle = (
      <div>
        <Icon style={iconStyle} type="user" /> Account Info
      </div>
    );
    const passwordTitle = (
      <div>
        <Icon style={iconStyle} type="unlock" /> Change Password
      </div>
    );

    return (
      <div>
        <h1>Account Settings</h1>
        <Row>
          <Col md={11} xs={24} sm={24}>
            <Card noHovering title={infoTitle}>
              <AccountInfoForm history={this.props.history} />
            </Card>
          </Col>

          <Col md={2} xs={24} sm={24}>
            &nbsp;
          </Col>
          <Col md={11} xs={24} sm={24}>
            <Card noHovering title={passwordTitle}>
              <ChangePasswordForm />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: '1rem' }} className="sessions-list">
          <Card noHovering title={sessionsTitle}>
            <SessionsTable />
          </Card>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
