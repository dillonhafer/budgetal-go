// App Concerns
import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {IsAuthenticated} from 'authentication';
import 'css/App.css';

// Layout
import Layout from 'antd/lib/layout';
import Header from 'layouts/Header';
import ApplicationLayout from 'layouts/ApplicationLayout';
import Footer from 'layouts/Footer';

// Redux
import {throttle} from 'lodash';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {loadState, saveState} from 'persistant-state';
import reducers from 'reducers';
const persistedState = loadState();
const store = createStore(reducers, {...persistedState});
store.subscribe(
  throttle(() => {
    saveState({
      mortgageCalculator: store.getState().mortgageCalculator,
    });
  }, 1000),
);

class App extends Component {
  state = {
    signedIn: IsAuthenticated(),
  };

  resetSignIn = () => {
    this.setState({signedIn: IsAuthenticated()});
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Layout>
              <Header resetSignIn={this.resetSignIn} />
              <ApplicationLayout />
              <Footer />
            </Layout>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
