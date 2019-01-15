import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';

// Components
import { BudgetRequest } from '@shared/api/budgets';
import ExpenseFormModal from './ExpenseFormModal';
import Sidebar from './Sidebar';
import BudgetCategory from './BudgetCategory';
import MonthlyOverview from './MonthlyOverview';
import MonthlyIncomeModal from './MonthlyIncomeModal';

import { Row, Col, Spin } from 'antd';
import { Pane, Heading } from 'evergreen-ui';

// Helpers
import { title } from 'window';
import { monthName } from '@shared/helpers';
import 'css/budgets.css';

class Budget extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
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
    const { loading } = this.state;
    const { budget } = this.props;
    return (
      <div className="no-padding">
        <Spin delay={300} size="large" tip="Loading..." spinning={loading}>
          <Pane paddingLeft={24} paddingRight={24} paddingBottom={16}>
            <Pane
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingBottom={16}
            >
              <Heading size={800}>
                {monthName(budget.month)} {budget.year}
              </Heading>
              <MonthlyIncomeModal />
            </Pane>
            <MonthlyOverview />
          </Pane>
          <Row>
            <Col span={4}>
              <Sidebar
                month={budget.month}
                year={budget.year}
                onChange={this.handleOnChange}
              />
            </Col>
            <Col span={20}>
              <BudgetCategory loading={loading} />
            </Col>
          </Row>
        </Spin>
        <ExpenseFormModal />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    budgetLoaded: ({
      budget,
      budgetCategories,
      budgetItems,
      budgetItemExpenses,
    }) => {
      dispatch(
        budgetLoaded({
          budget,
          budgetCategories,
          budgetItems,
          budgetItemExpenses,
        }),
      );
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Budget);
