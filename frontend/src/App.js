import React, {Component} from 'react';
import './App.css';
import Button from 'antd/lib/button';
import request from './request';

import {notice, error} from './notifications';
window.notice = notice;
window.error = error;

class App extends Component {
  submit = async e => {
    try {
      e.preventDefault();
      const resp = await request.post('/sign-in', {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      if (resp && resp.ok) {
        window.notice('You are now signed in');
        localStorage.setItem('_budgetal_session', resp.token);
        localStorage.setItem('_budgetal_user', JSON.stringify(resp.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  signout = async e => {
    try {
      e.preventDefault();
      const resp = await request.delete('/sign-out');
      if (resp && resp.ok) {
        localStorage.removeItem('_budgetal_session');
        localStorage.removeItem('_budgetal_user');
        window.notice('You have been signed out.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={this.submit}>
          <input type="text" name="email" />
          <input type="password" name="password" />
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </form>
        <Button type="danger" onClick={this.signout}>
          Sign Out
        </Button>
      </div>
    );
  }
}

export default App;
