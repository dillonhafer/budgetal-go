import React, { Component } from 'react';

// Components
import { BudgetRequest } from '@shared/api/budgets';
import ExpenseFormModal from './ExpenseFormModal';
import Sidebar from './Sidebar';
import BudgetCategory from './BudgetCategory';
import MonthlyOverview from './MonthlyOverview';
import MonthlyIncomeModal from './MonthlyIncomeModal';
import Spinner from 'components/Spinner';
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

  render() {
    const { loading } = this.state;
    const { budget } = this.props;
    return (
      <Pane className="no-padding">
        {loading && (
          <Pane
            position="fixed"
            top="100px"
            with="100%"
            left="50%"
            marginLeft="-32px"
          >
            <Spinner visible={true} />
          </Pane>
        )}
        <Pane
          opacity={loading ? 0.5 : 1}
          paddingLeft={24}
          paddingRight={24}
          paddingBottom={16}
        >
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
        <Pane display="flex" flexDirection="row" opacity={loading ? 0.5 : 1}>
          <Pane width={200}>
            <Sidebar
              history={this.props.history}
              month={budget.month}
              year={budget.year}
            />
          </Pane>
          <Pane width="100%">
            <BudgetCategory loading={loading} />
          </Pane>
        </Pane>
        <ExpenseFormModal />
      </Pane>
    );
  }
}

export default Budget;
