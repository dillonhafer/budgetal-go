import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';

// Components
import { BudgetRequest } from 'api/budgets';
import Sidebar from './Sidebar';
import { Row, Spin } from 'antd';

// Helpers
import { title, scrollTop } from 'window';
import { monthName } from 'helpers';
import 'css/budgets.css';

class Budget extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    scrollTop();
    this.loadBudget();
    this.updateTitle(this.props.match.params);
  }

  updateTitle({ month, year }) {
    title(`${monthName(month)} ${year} | Budgets`);
  }

  findCurrentCategory(resp) {
    if (window.location.hash) {
      const hashCategory = window.location.hash.replace('#', '');
      return resp.budgetCategories.find(c => {
        return c.name.toLowerCase().replace('/', '-') === hashCategory;
      });
    }

    return resp.budgetCategories[0];
  }

  loadBudget = async () => {
    try {
      this.setState({ loading: true });
      const { month, year } = this.props.match.params;
      const resp = await BudgetRequest({ month, year });

      if (resp && resp.ok) {
        const currentCategory = this.findCurrentCategory(resp);

        this.props.budgetLoaded(resp);
        this.props.changeCategory(currentCategory);
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
    const { budget } = this.props;
    return (
      <div className="no-padding">
        <Spin
          delay={300}
          size="large"
          tip="Loading..."
          spinning={this.state.loading}
        >
          <div className="with-padding">
            <h1>
              {monthName(budget.month)} {budget.year}
            </h1>
          </div>
          <Row>
            <Sidebar
              month={budget.month}
              year={budget.year}
              onChange={this.handleOnChange}
            />
          </Row>
        </Spin>
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
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Budget);
