// App Concerns
import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {IsAuthenticated} from 'authentication';
import './App.css';

// Layout
import Layout from 'antd/lib/layout';
import Header from './Header';
import Footer from './Footer';

// Route Components
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Privacy from './Privacy';
import NoMatch from './NoMatch';
import MortgageCalculator from './MortgageCalculator';
import AnnualBudget from './AnnualBudget';

const {Content} = Layout;

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
                        timeout={300}
                      >
                        <div>
                          <Switch key={location.key} location={location}>
                            <Route exact path="/" component={Home} />
                            <Route path="/privacy" component={Privacy} />
                            <Route
                              path="/calculators/mortgage"
                              component={MortgageCalculator}
                            />
                            <PrivateRoute
                              path="/annual-budgets/:year"
                              component={AnnualBudget}
                            />
                            <Route component={NoMatch} />
                          </Switch>
                        </div>
                      </CSSTransition>
                    </TransitionGroup>
                  )}
                />
              </div>
            </Content>
            <Footer />
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
