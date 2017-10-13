import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  post = async (url, body) => {
    try {
      const req = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          _budgetal_session: localStorage.getItem('_budgetal_session'),
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
      };
      const resp = await fetch(url, req);

      if (resp.status === 503) {
        window.alert('YOU IN MAINT MAN');
        return;
      }

      if (!resp.ok) {
        const text = await resp.text();
        const error = {
          ...JSON.parse(text),
          status: resp.status,
        };
        throw error;
      }

      const json = await resp.json();
      return json;
    } catch (err) {
      window.alert(err.error + 'due to ' + err.status);
    }
  };

  delete = async (url, body) => {
    try {
      const req = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          _budgetal_session: localStorage.getItem('_budgetal_session'),
        },
        credentials: 'include',
        method: 'DELETE',
        body: JSON.stringify(body),
      };
      const resp = await fetch(url, req);

      if (resp.status === 503) {
        window.alert('YOU IN MAINT MAN');
        return;
      }

      if (!resp.ok) {
        const text = await resp.text();
        const error = {
          ...JSON.parse(text),
          status: resp.status,
          ok: false,
        };
        throw error;
      }

      const json = await resp.json();
      return {...json, ok: true};
    } catch (err) {
      window.alert(err.error + 'due to ' + err.status);
    }
  };

  get = async url => {
    try {
      const req = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          _budgetal_session: localStorage.getItem('_budgetal_session'),
        },
        credentials: 'include',
        method: 'GET',
      };
      const resp = await fetch(url, req);

      if (resp.status === 503) {
        window.alert('YOU IN MAINT MAN');
        return;
      }

      if (!resp.ok) {
        const text = await resp.text();
        const error = {
          ...JSON.parse(text),
          status: resp.status,
          ok: false,
        };
        throw error;
      }

      const json = await resp.json();
      return {...json, ok: true};
    } catch (err) {
      window.alert(err.error + ' due to ' + err.status);
    }
  };

  submit = async e => {
    try {
      e.preventDefault();
      const json = await this.post('/sign-in', {
        email: e.target.email.value,
        password: e.target.password.value,
      });
      if (json !== null) {
        localStorage.setItem('_budgetal_session', json.token);
        localStorage.setItem('_budgetal_user', JSON.stringify(json.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  signout = async e => {
    try {
      e.preventDefault();
      const resp = await this.delete('/sign-out');
      if (resp.ok) {
        localStorage.removeItem('_budgetal_session');
        localStorage.removeItem('_budgetal_user');
        console.log(resp);
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={this.submit}>
          <input type="text" name="email" />
          <input type="password" name="password" />
          <input type="submit" />
        </form>
        <a onClick={this.signout}>Delete</a>
      </div>
    );
  }
}

export default App;
