import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { error } from 'window';
import { IsAuthenticated } from 'authentication';

class PrivateRoute extends Component {
  componentDidMount() {
    if (!IsAuthenticated()) {
      error('You must sign in');
      this.props.history.replace('/');
    }
  }

  render() {
    if (!IsAuthenticated()) {
      return null;
    }

    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          return <Component {...props} />;
        }}
      />
    );
  }
}
export default withRouter(PrivateRoute);
