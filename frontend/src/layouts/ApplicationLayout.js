import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

// Route Components
import PrivateRoute from 'routes/PrivateRoute';
import Home from 'routes/Home';
import Privacy from 'routes/Privacy';
import Budget from 'routes/budgets';
import AnnualBudget from 'routes/annual-budgets';
import MortgageCalculator from 'routes/calculators/mortgage';
import Statistics from 'routes/statistics';
import Admin from 'routes/admin';
import ResetPassword from 'routes/reset-password';
import AccountSettings from 'routes/account-settings';

// Error Routes
import NoMatch from 'routes/NoMatch';
import Maintenance from 'routes/Maintenance';

class ApplicationLayout extends Component {
  render() {
    return (
      <Layout.Content>
        <Route
          render={({ location }) => (
            <div>
              <Switch key={location.key} location={location}>
                <Route exact path="/" component={Home} />
                <Route path="/privacy" component={Privacy} />
                <Route
                  path="/calculators/mortgage"
                  component={MortgageCalculator}
                />
                <PrivateRoute path="/budgets/:year/:month" component={Budget} />
                <PrivateRoute
                  path="/annual-budgets/:year"
                  component={AnnualBudget}
                />
                <PrivateRoute
                  path="/monthly-statistics/:year/:month"
                  component={Statistics}
                />
                <PrivateRoute
                  path="/account-settings"
                  component={AccountSettings}
                />
                <Route path="/admin" component={Admin} />
                <Route path="/reset-password" component={ResetPassword} />

                <Route path="/maintenance" component={Maintenance} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          )}
        />
      </Layout.Content>
    );
  }
}

export default ApplicationLayout;
