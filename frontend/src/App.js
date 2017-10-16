import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';
import Layout from 'antd/lib/layout';
import {IsAuthenticated} from 'authentication';

import {notice, error} from './notifications';
import Header from './Header';
window.notice = notice;
window.error = error;
const {Content, Footer} = Layout;

const Home = () => {
  return <p>Home</p>;
};
const Help = () => {
  return <p>Help</p>;
};
const Privacy = () => {
  return <p>Privacy</p>;
};
const Topics = () => {
  return <p>Topics</p>;
};

class App extends Component {
  state = {
    signedIn: IsAuthenticated(),
  };

  resetSignIn = () => {
    this.setState({signedIn: IsAuthenticated()});
  };

  handleMenuSelect = item => {
    if (item.key === '1') {
      window.notice('session link');
    }
    if (item.key === '2') {
      this.signout();
    }
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Layout>
            <Header />
            <Content style={{padding: '50px', marginTop: 64}}>
              <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                <Route exact path="/" component={Home} />
                <Route path="/help" component={Help} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/calculators/mortgage" component={Topics} />
              </div>
            </Content>

            <Footer style={{textAlign: 'center'}}>
              Budgetal © 2013-{new Date().getFullYear()} All rights reserved
              <p>
                <Link to="/privacy">Privacy</Link> |{' '}
                <Link to="/help">Help</Link>
              </p>
            </Footer>
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
