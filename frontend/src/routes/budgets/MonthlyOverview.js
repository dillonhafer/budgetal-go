import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';

// Helpers
import { currencyf, reduceSum } from '@shared/helpers';

// Components
import { Alert } from 'evergreen-ui';
import SpentProgress from 'components/Progress/SpentProgress';

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
    const p = (this.amountSpent() / this.amountBudgeted()) * 100;

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
    const overageMessage = (
      <div>
        You have over budgeted by <strong>{currencyf(Math.abs(left))}</strong>
      </div>
    );
    const underMessage = (
      <div>
        You still need to budget <strong>{currencyf(left)}</strong>
      </div>
    );

    switch (true) {
      case left > 0:
        return <Alert intent="warning" title={underMessage} marginTop={16} />;
      case left < 0:
        return <Alert intent="danger" title={overageMessage} marginTop={16} />;
      default:
        return null;
    }
  };

  render() {
    const status = this.status();
    const percent = this.percentSpent();
    const spent = this.amountSpent();
    const remaining = this.amountRemaining();

    return (
      <div>
        <SpentProgress
          status={status}
          percent={percent}
          spent={spent}
          remaining={remaining}
        />
        {this.warnings()}
      </div>
    );
  }
}

export default connect(state => ({
  budget: state.budget.budget,
  budgetItems: state.budget.budgetItems,
  budgetItemExpenses: state.budget.budgetItemExpenses,
}))(MonthlyOverview);
