// App Concerns
import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {IsAuthenticated} from 'authentication';
import './App.css';

// Layout
import Layout from 'antd/lib/layout';
import Header from './Header';
import ApplicationLayout from './ApplicationLayout';
import Footer from './Footer';

class App extends Component {
  state = {
    signedIn: IsAuthenticated(),
  };

  resetSignIn = () => {
    this.setState({signedIn: IsAuthenticated()});
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Layout>
            <Header resetSignIn={this.resetSignIn} />
            <ApplicationLayout />
            <Footer />
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
