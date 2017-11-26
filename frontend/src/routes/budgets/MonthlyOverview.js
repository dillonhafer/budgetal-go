import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';

// Helpers
import { currencyf, reduceSum } from 'helpers';

// Components
import { Progress, Alert } from 'antd';

class MonthlyOverview extends Component {
  state = {
    visible: false,
  };

  amountBudgeted = () => {
    return reduceSum(this.props.budgetItems);
  };

  amountSpent = () => {
    return reduceSum(this.props.budgetItemExpenses);
  };

  amountRemaining = () => {
    return this.amountBudgeted() - this.amountSpent();
  };

  percentSpent() {
    const p = this.amountSpent() / this.amountBudgeted() * 100;

    if (isNaN(p)) {
      return 0;
    }
    if (p > 99) {
      return 100;
    }

    return parseInt(p, 10);
  }

  status() {
    return this.amountRemaining() < 0 ? 'exception' : 'normal';
  }

  warnings = () => {
    const { budget } = this.props;
    const amountBudgeted = this.amountBudgeted();
    const left = budget.income - amountBudgeted;
    switch (true) {
      case left > 0:
        const underMessage = (
          <div>
            You still need to budget <strong>{currencyf(left)}</strong>
          </div>
        );
        return [
          <Alert
            key={`alert`}
            showIcon
            message={underMessage}
            type="warning"
          />,
          <br key={`br`} />,
        ];
      case left < 0:
        const overageMessage = (
          <div>
            You have over budgeted by{' '}
            <strong>{currencyf(Math.abs(left))}</strong>
          </div>
        );
        return [
          <Alert
            key={`alert`}
            showIcon
            message={overageMessage}
            type="error"
          />,
          <br key={`br`} />,
        ];
      default:
        return null;
    }
  };

  render() {
    const spent = this.percentSpent();
    const status = this.status();
    return (
      <div>
        <div style={{ clear: 'both' }}>
          <h3 style={{ float: 'left' }}>
            Spent: {currencyf(this.amountSpent())}
          </h3>
          <h3 style={{ float: 'right' }}>
            Remaining: {currencyf(this.amountRemaining())}
          </h3>
          <Progress strokeWidth={20} status={status} percent={spent} />
        </div>
        <br />
        {this.warnings()}
      </div>
    );
  }
}

export default connect(state => ({
  ...state.budget,
}))(MonthlyOverview);
