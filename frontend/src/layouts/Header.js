import React, { Component } from 'react';
import { SignOutRequest } from '@shared/api/sessions';
import {
  RemoveAuthentication,
  IsAuthenticated,
  GetCurrentUser,
} from 'authentication';
import {
  Pane,
  Avatar,
  Spinner,
  toaster,
  Text,
  Position,
  Popover,
  Menu,
} from 'evergreen-ui';
import SignIn from './SignIn';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { scrollTop, notice } from 'window';

const ProfileImage = ({ user }) => {
  let src = '/missing-profile.png';
  if (user.avatarUrl) {
    src = user.avatarUrl;
  }

  if (process.env.NODE_ENV === 'development' && user.avatarUrl) {
    src = new URL(user.avatarUrl).pathname;
  }

  return (
    <Avatar
      {...(/.*missing-profile.*/.test(src) ? {} : { src })}
      name={`${user.firstName || '?'} ${user.lastName || '?'}`}
      size={42}
      marginRight={10}
    />
  );
};

class Header extends Component {
  signOut = () => {
    toaster.notify(
      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Spinner size={16} />
        <Text marginLeft={8}>Sign out in progress...</Text>
      </Pane>,
      { id: 'logout' },
    );

    SignOutRequest().then(r => {
      if (r.ok) {
        RemoveAuthentication();
        this.props.resetSignIn();
        notice('You have been signed out', { id: 'logout' });
        this.props.history.push('/');
      }
    });
  };

  onSelect = ({ target: { innerText } }) => {
    document.querySelector('#root').click();

    if (innerText === 'Sign out') {
      return this.signOut();
    }

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const link = {
      'Account Settings': '/account-settings',
      'Statistics (for geeks)': `/monthly-statistics/${year}/${month}`,
      'Admin Panel': '/admin',
      Mortgage: '/calculators/mortgage',
    }[innerText];
    if (link) this.props.history.push(link);
  };

  renderMenuItems = () => {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = GetCurrentUser();
      return [
        <NavLink
          key="budgets"
          to={`/budgets/${year}/${month}`}
          isActive={this.selectedKeys}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Budgets</Text>
          </Pane>
        </NavLink>,
        <NavLink
          key="annual"
          to={`/annual-budgets/${year}`}
          isActive={this.selectedKeys}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Annual Budgets</Text>
          </Pane>
        </NavLink>,
        <NavLink
          key="networth"
          to={`/net-worth/${year}`}
          isActive={this.selectedKeys}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Net Worth</Text>
          </Pane>
        </NavLink>,
        <Popover
          key="calc"
          position={Position.TOP_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onSelect={this.onSelect} icon="home">
                  Mortgage
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
            className="anchor"
          >
            <Text color="unset">Calculators</Text>
          </Pane>
        </Popover>,
        <Popover
          key="user-menu"
          position={Position.TOP_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onSelect={this.onSelect} icon="pie-chart">
                  Statistics (for geeks)
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onSelect={this.onSelect} icon="cog">
                  Account Settings
                </Menu.Item>
                <Menu.Divider />
                {user.admin && (
                  <Menu.Item onSelect={this.onSelect} icon="lock">
                    Admin Panel
                  </Menu.Item>
                )}
                {user.admin && <Menu.Divider />}
                <Menu.Item onSelect={this.onSelect} icon="log-out">
                  Sign out
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            cursor="pointer"
            height={64}
            display="flex"
            flexDirection="row"
            alignItems="center"
            className="anchor"
          >
            <ProfileImage user={user} />
            <Text color="unset">
              Hello
              {user.firstName ? `, ${user.firstName}` : ''}!
            </Text>
          </Pane>
        </Popover>,
      ];
    } else {
      return [
        <Popover
          key="calc"
          position={Position.TOP_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onSelect={this.onSelect} icon="home">
                  Mortgage
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
            className="anchor"
          >
            <Text color="unset">Calculators</Text>
          </Pane>
        </Popover>,
        <Pane
          key="signin"
          paddingX={20}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          height={64}
        >
          <SignIn resetSignIn={this.props.resetSignIn} />
        </Pane>,
      ];
    }
  };

  selectedKeys(match, loc) {
    if (!match) {
      return false;
    }
    const location = match.path;
    switch (true) {
      case /\/budgets/.test(location):
        return true;
      case /\/detailed-budgets/.test(location):
        return true;
      case /\/annual-budgets/.test(location):
        return true;
      case /\/net-worth/.test(location):
        return true;
      case /\/calculators\/mortgage/.test(location):
        return true;
      default:
        return false;
    }
  }

  render() {
    return (
      <Pane
        position="fixed"
        width="100%"
        background="rgba(16, 142, 233, 0.96)"
        zIndex={9999}
        paddingX={50}
        paddingY={0}
        height="64px"
        lineHeight="64px"
        flex="0 0 auto"
        onClick={scrollTop}
      >
        <Pane
          className="header"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Link to="/">
            <div className="logo" />
          </Link>

          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            {this.renderMenuItems()}
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default withRouter(Header);
