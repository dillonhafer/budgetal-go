import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded } from 'actions/budgets';

// Components
import { BudgetRequest } from 'api/budgets';

// Helpers
import { title, scrollTop } from 'window';
import { monthName } from 'helpers';

class Budget extends Component {
  componentDidMount() {
    scrollTop();
    this.loadBudget();
    this.updateTitle(this.props.match.params);
  }

  updateTitle({ month, year }) {
    title(`${monthName(month)} ${year} | Budgets`);
  }

  loadBudget = async () => {
    try {
      this.setState({ loading: true });
      const { month, year } = this.props.match.params;
      const resp = await BudgetRequest({ month, year });

      if (resp && resp.ok) {
        this.props.budgetLoaded(resp);
        this.updateTitle(resp.budget);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleOnChange = date => {
    this.props.history.push(`/budgets/${date.year()}/${date.month() + 1}`);
  };

  render() {
    const { budget, budgetCategories } = this.props;
    return (
      <div>
        Hi {budget.month} - {budget.income}
        {budgetCategories.map(c => {
          return (
            <p key={c.id}>
              {c.name} - {c.id} - {c.percentage}
            </p>
          );
        })}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    budgetLoaded: ({ budget, budgetCategories }) => {
      dispatch(budgetLoaded({ budget, budgetCategories }));
    },
  }),
)(Budget);
