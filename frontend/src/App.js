import React, {Component} from 'react';
import './App.css';
import SignIn from './SignIn';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import request from './request';

import {notice, error} from './notifications';
window.notice = notice;
window.error = error;
const {Header, Content, Footer} = Layout;

const isCurrentUser = () => {
  return (localStorage.getItem('_budgetal_session') || '').length > 0;
};

class App extends Component {
  state = {
    signedIn: isCurrentUser(),
  };

  resetSignIn = () => {
    this.setState({signedIn: isCurrentUser()});
  };

  signout = async e => {
    try {
      e.preventDefault();
      const resp = await request.delete('/sign-out');
      if (resp && resp.ok) {
        localStorage.removeItem('_budgetal_session');
        localStorage.removeItem('_budgetal_user');
        window.notice('You have been signed out');
        this.resetSignIn();
      }
    } catch (err) {
      console.log(err);
    }
  };

  onClick = item => {
    if (item.key === '1') {
      window.notice('session link');
    }
  };

  render() {
    const {signedIn} = this.state;
    const signOutLink = <Menu.Item key="1">Sign Out</Menu.Item>;

    const sessionItem = signedIn ? (
      signOutLink
    ) : (
      <Menu.Item selectable={false} key="1">
        <SignIn callback={this.resetSignIn} />
      </Menu.Item>
    );

    return (
      <div className="App">
        <Layout>
          <Header style={{position: 'fixed', width: '100%'}}>
            <div className="logo" />
            <Menu
              onSelect={this.handleMenuSelect}
              theme="dark"
              mode="horizontal"
              style={{lineHeight: '64px'}}
            >
              {sessionItem}
            </Menu>
          </Header>
          <Content style={{padding: '50px', marginTop: 64}}>
            <div style={{background: '#fff', padding: 24, minHeight: 380}}>
              Content
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Budgetal © {new Date().getFullYear()}
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
