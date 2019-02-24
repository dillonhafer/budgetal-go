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
  Icon,
  Menu,
} from 'evergreen-ui';
import SignIn from './SignIn';
import { Link } from 'react-router-dom';
import { scrollTop, notice } from 'window';
import { colors } from '@shared/theme';

const ProfileImage = React.memo(({ user }) => {
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
});

const NavMenuItem = React.memo(({ icon, active, to, title, ...rest }) => (
  <Menu.Item
    {...rest}
    className={active ? 'headermenu active' : 'headermenu'}
    is={to ? Link : Pane}
    icon={
      <Icon
        icon={icon}
        marginLeft={16}
        marginRight={-4}
        color={active ? 'white' : colors.primary}
      />
    }
    to={to}
  >
    <Text color={colors.primary}>{title}</Text>
  </Menu.Item>
));

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
        setTimeout(() => {
          window.location = '/';
        }, 1000);
      }
    });
  };

  renderMenuItems = () => {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = GetCurrentUser();
      return [
        <Link
          key="budgets"
          to={`/budgets/${year}/${month}`}
          className={this.activeRoute() === 'budgets' ? 'active' : ''}
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
        </Link>,
        <Link
          key="annual"
          to={`/annual-budgets/${year}`}
          className={this.activeRoute() === 'annual-budgets' ? 'active' : ''}
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
        </Link>,
        <Link
          key="networth"
          to={`/net-worth/${year}`}
          className={this.activeRoute() === 'net-worth' ? 'active' : ''}
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
        </Link>,
        <Popover
          key="calc"
          position={Position.TOP_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <NavMenuItem
                  active={this.activeRoute() === 'calculators'}
                  to="/calculators/mortgage"
                  title="Mortgage"
                  icon="home"
                />
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
            className={
              this.activeRoute() === 'calculators' ? 'anchor active' : 'anchor'
            }
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
                <NavMenuItem
                  active={this.activeRoute() === 'statistics'}
                  to={`/monthly-statistics/${year}/${month}`}
                  title="Statistics (for geeks)"
                  icon="pie-chart"
                />
                <Menu.Divider />
                <NavMenuItem
                  active={this.activeRoute() === 'account-settings'}
                  to="/account-settings"
                  title="Account Settings"
                  icon="cog"
                />
                <Menu.Divider />
                {user.admin && (
                  <NavMenuItem
                    active={this.activeRoute() === 'admin'}
                    to="/admin"
                    title="Admin Panel"
                    icon="lock"
                  />
                )}
                {user.admin && <Menu.Divider />}
                <NavMenuItem
                  onSelect={this.signOut}
                  title="Sign Out"
                  icon="log-out"
                />
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
            className={
              ['statistics', 'account-settings', 'admin'].includes(
                this.activeRoute(),
              )
                ? 'anchor active'
                : 'anchor'
            }
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
                <NavMenuItem
                  active={this.activeRoute() === 'calculators'}
                  to="/calculators/mortgage"
                  title="Mortgage"
                  icon="home"
                />
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
            className={
              this.activeRoute() === 'calculators' ? 'anchor active' : 'anchor'
            }
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

  activeRoute() {
    switch (true) {
      case /\/budgets/.test(window.location.pathname):
        return 'budgets';
      case /\/detailed-budgets/.test(window.location.pathname):
        return 'detailed-budgets';
      case /\/annual-budgets/.test(window.location.pathname):
        return 'annual-budgets';
      case /\/net-worth/.test(window.location.pathname):
        return 'net-worth';
      case /\/calculators\/mortgage/.test(window.location.pathname):
        return 'calculators';
      case /\/account-settings/.test(window.location.pathname):
        return 'account-settings';
      case /\/monthly-statistics/.test(window.location.pathname):
        return 'statistics';
      case /\/admin/.test(window.location.pathname):
        return 'admin';
      default:
        return '';
    }
  }

  render() {
    return (
      <Pane
        position="fixed"
        width="100%"
        elevation={2}
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

export default Header;
