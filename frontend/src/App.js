import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import './App.css';
import Layout from 'antd/lib/layout';
import {IsAuthenticated} from 'authentication';

import {notice, error} from './notifications';
import Header from './Header';

window.notice = notice;
window.error = error;
const {Content, Footer} = Layout;

window.title = string => {
  let title = 'Budgetal';
  if (string.length) {
    title = `${string} | Budgetal`;
  }
  document.title = title;
};
class Home extends Component {
  componentDidMount() {
    window.title('');
    window.scrollTo(0, 0);
  }
  render() {
    return <h1>Home</h1>;
  }
}
class Help extends Component {
  componentDidMount() {
    window.title('Help');
    window.scrollTo(0, 0);
  }
  render() {
    return <h1>Help</h1>;
  }
}
class Privacy extends Component {
  componentDidMount() {
    window.title('Privacy');
    window.scrollTo(0, 0);
  }
  render() {
    return <h1>Privacy</h1>;
  }
}
class MortgageCalculator extends Component {
  componentDidMount() {
    window.title('Mortgage | Calculators');
    window.scrollTo(0, 0);
  }
  render() {
    return <h1>Mortgage Calculator</h1>;
  }
}
class NoMatch extends Component {
  componentDidMount() {
    window.title('404 Not Found');
    window.scrollTo(0, 0);
  }
  render() {
    return <h1>Oh no! We cant find that page</h1>;
  }
}

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
            <Content style={{padding: '50px', marginTop: 64}}>
              <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                <Route
                  render={({location}) => (
                    <TransitionGroup>
                      <CSSTransition
                        key={location.key}
                        classNames="fade"
                        timeout={{enter: 300, exit: 300}}
                      >
                        <Switch key={location.key} location={location}>
                          <Route exact path="/" component={Home} />
                          <Route path="/help" component={Help} />
                          <Route path="/privacy" component={Privacy} />
                          <Route
                            path="/calculators/mortgage"
                            component={MortgageCalculator}
                          />
                          <Route component={NoMatch} />
                        </Switch>
                      </CSSTransition>
                    </TransitionGroup>
                  )}
                />
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
