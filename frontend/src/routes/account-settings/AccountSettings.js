import React, { PureComponent } from 'react';
import AccountInfoForm from './AccountInfoForm';
import ChangePasswordForm from './ChangePasswordForm';
import SessionsTable from './SessionsTable';

import { title, scrollTop } from 'window';
import { Pane } from 'evergreen-ui';
import Card from 'components/Card';
import Header from 'components/Header';

class AccountSettings extends PureComponent {
  componentDidMount() {
    title('Account Settings');
    scrollTop();
  }

  render() {
    return (
      <Pane>
        <Header heading="Account Settings" />
        <Pane paddingX={24} marginTop={16} display="flex" flexDirection="row">
          <Pane
            display="flex"
            flex="1"
            minHeight={300}
            flexDirection="column"
            marginRight={16}
          >
            <Card title={'Account Info'}>
              <Pane minHeight={300}>
                <AccountInfoForm history={this.props.history} />
              </Pane>
            </Card>
          </Pane>

          <Pane display="flex" flex="1" flexDirection="column" marginLeft={16}>
            <Card title={'Change Password'}>
              <Pane minHeight={300}>
                <ChangePasswordForm />
              </Pane>
            </Card>
          </Pane>
        </Pane>
        <Pane paddingX={24} marginTop={32}>
          <SessionsTable />
        </Pane>
      </Pane>
    );
  }
}

export default AccountSettings;
