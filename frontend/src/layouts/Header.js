import React, { Component } from 'react';
import { SignOutRequest } from '@shared/api/sessions';
import {
  RemoveAuthentication,
  IsAuthenticated,
  GetCurrentUser,
} from 'authentication';
import { Menu } from 'antd';
import { Icon, Pane, Avatar, Spinner, toaster, Text } from 'evergreen-ui';
import SignIn from './SignIn';
import { Link, NavLink } from 'react-router-dom';
import { scrollTop, notice } from 'window';

const ItemIcon = React.memo(({ icon }) => (
  <Icon icon={icon} size={14} marginRight={8} marginBottom={-2} />
));

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

export default class Header extends Component {
  signOut = async e => {
    e.preventDefault();

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
        document.querySelector('.logo').click();
      }
    });
  };

  adminLink(admin) {
    let items = [];
    if (admin) {
      items.push(
        <Menu.Item key="admin-link">
          <Link to="/admin">
            <ItemIcon icon="lock" />
            Admin Panel
          </Link>
        </Menu.Item>,
      );
      items.push(<Menu.Divider key="divider3" />);
    }
    return items;
  }

  renderMenuItems = () => {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = GetCurrentUser();
      return [
        <Menu.Item key="budgets">
          <Link to={`/budgets/${year}/${month}`}> Budgets</Link>
        </Menu.Item>,
        <Menu.Item key="annual-budgets">
          <NavLink to={`/annual-budgets/${year}`}>Annual Budgets</NavLink>
        </Menu.Item>,
        <Menu.Item key="net-worth">
          <NavLink to={`/net-worth/${year}`}>Net Worth</NavLink>
        </Menu.Item>,
        <Menu.SubMenu key="submenu-calc" title="Calculators">
          <Menu.Item key="mortgage-calculator">
            <Link to={`/calculators/mortgage`}>
              <ItemIcon icon="home" />
              Mortgage
            </Link>
          </Menu.Item>
        </Menu.SubMenu>,
        <Menu.SubMenu
          key="submenu"
          title={
            <Pane
              paddingY={11}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <ProfileImage user={user} />
              <Text color="hsla(0,0%,100%,.67)">
                Hello
                {user.firstName ? `, ${user.firstName}` : ''}!
              </Text>
            </Pane>
          }
        >
          <Menu.Item key="stats">
            <Link to={`/monthly-statistics/${year}/${month}`}>
              <ItemIcon icon="pie-chart" />
              Statistics (for geeks)
            </Link>
          </Menu.Item>
          <Menu.Divider key="divider1" />
          <Menu.Item key="account-settings">
            <Link to="/account-settings">
              <ItemIcon icon="cog" />
              Account Settings
            </Link>
          </Menu.Item>
          <Menu.Divider key="divider2" />
          {this.adminLink(user.admin)}
          <Menu.Item key="sign-out">
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                outline: 'none',
                width: '100%',
              }}
              onClick={this.signOut}
              title="Sign out"
              rel="nofollow"
            >
              <ItemIcon icon="log-out" />
              Sign out
            </button>
          </Menu.Item>
        </Menu.SubMenu>,
      ];
    } else {
      return [
        <Menu.SubMenu key="submenu-calc" title="Calculators">
          <Menu.Item key="mortgage-calculator">
            <Link to="/calculators/mortgage">
              <ItemIcon icon="home" />
              Mortgage
            </Link>
          </Menu.Item>
        </Menu.SubMenu>,
        <Menu.Item key="sign-in">
          <SignIn resetSignIn={this.props.resetSignIn} />
        </Menu.Item>,
      ];
    }
  };

  selectedKeys(location) {
    switch (true) {
      case /\/budgets/.test(location):
        return ['budgets'];
      case /\/detailed-budgets/.test(location):
        return ['detailed-budgets'];
      case /\/annual-budgets/.test(location):
        return ['annual-budgets'];
      case /\/net-worth/.test(location):
        return ['net-worth'];
      case /\/calculators\/mortgage/.test(location):
        return ['mortgage-calculator'];
      default:
        return [];
    }
  }

  render() {
    const selectedKeys = this.selectedKeys(window.location);

    return (
      <Pane
        position="fixed"
        width="100%"
        background="rgba(64, 64, 64, 0.96)"
        zIndex={9999}
        paddingX={50}
        paddingY={0}
        height="64px"
        lineHeight="64px"
        flex="0 0 auto"
        onClick={scrollTop}
      >
        <Pane display="flex" flexDirection="row" justifyContent="space-between">
          <Link to="/" aria-label="Home">
            <div className="logo" />
          </Link>

          <Menu
            onSelect={this.handleMenuSelect}
            theme="dark"
            selectedKeys={selectedKeys}
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          >
            {this.renderMenuItems()}
          </Menu>
        </Pane>
      </Pane>
    );
  }
}
