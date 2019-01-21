import React, { PureComponent } from 'react';
import AccountInfoForm from './AccountInfoForm';
import ChangePasswordForm from './ChangePasswordForm';
import SessionsTable from './SessionsTable';

import { title, scrollTop } from 'window';
import { Pane, Heading, Card } from 'evergreen-ui';

class AccountSettings extends PureComponent {
  componentDidMount() {
    title('Account Settings');
    scrollTop();
  }

  render() {
    return (
      <Pane>
        <Heading marginBottom={16} size={800}>
          ACCOUNT SETTINGS
        </Heading>

        <Pane display="flex" flexDirection="row">
          <Pane
            display="flex"
            flex="1"
            height={300}
            flexDirection="column"
            marginRight={16}
          >
            <Card height={300} background="tint2" padding={16}>
              <Heading size={600} marginBottom={16}>
                Account Info
              </Heading>
              <AccountInfoForm history={this.props.history} />
            </Card>
          </Pane>

          <Pane display="flex" flex="1" flexDirection="column" marginLeft={16}>
            <Card height={300} background="tint2" padding={16}>
              <Heading size={600} marginBottom={16}>
                Change Password
              </Heading>
              <ChangePasswordForm />
            </Card>
          </Pane>
        </Pane>
        <Pane marginTop={32}>
          <Card background="tint2" padding={16}>
            <Heading size={600}>Sessions</Heading>
            <SessionsTable />
          </Card>
        </Pane>
      </Pane>
    );
  }
}

export default AccountSettings;
