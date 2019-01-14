import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { newExpense } from 'actions/budget-item-expenses';

// Components
import BudgetItemExpenseForm from './BudgetItemExpenseForm';
import { Table } from 'antd';
import { Pane, Button } from 'evergreen-ui';

// Helpers
import { find, groupBy, orderBy } from 'lodash';
import moment from 'moment';

class BudgetItemExpenseList extends Component {
  state = {
    loading: false,
  };

  newExpenseHandler = e => {
    e.preventDefault();
    this.props.newExpense(this.props.budgetItem.id);
  };

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  addExpenseLink(expenses, newFunction) {
    const disabled =
      find(expenses, expense => expense.id === null) !== undefined;
    return (
      <Button
        height={32}
        marginBottom={16}
        appearance="primary"
        onClick={newFunction}
        iconBefore="add"
        disabled={disabled}
      >
        Add an Expense
      </Button>
    );
  }

  emptyCell = {
    children: <div />,
    props: { colSpan: 0 },
  };

  columns = [
    {
      title: 'Date',
      dataIndex: 'expense',
      key: 'date',
      className: 'expense-row',
      render: expense => {
        if (expense.name === 'date-group') {
          return {
            children: <h4>{expense.date}</h4>,
            props: {
              className: 'date-row',
              colSpan: 24,
            },
          };
        } else {
          return {
            children: <BudgetItemExpenseForm expense={expense} />,
            props: {
              colSpan: 24,
            },
          };
        }
      },
    },
    {
      title: 'Name',
      dataIndex: 'expense',
      key: 'name',
      render: expense => {
        return this.emptyCell;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'expense',
      key: 'amount',
      render: expense => {
        return this.emptyCell;
      },
    },
    {
      title: '',
      dataIndex: 'expense',
      key: 'actions',
      render: expense => {
        return this.emptyCell;
      },
    },
  ];

  render() {
    const budgetItemExpenses = this.props.budgetItemExpenses.filter(e => {
      return e.budgetItemId === this.props.budgetItem.id;
    });

    const sections = groupBy(
      orderBy(budgetItemExpenses, ['date', 'id'], ['desc', 'desc']),
      'date',
    );

    let dataSource = [];
    Object.keys(sections).map(section => {
      const date = moment(section, 'YYYY-MM-DD').format('dddd - MMM DD, YYYY');
      dataSource.push({ expense: { name: 'date-group', date }, key: section });

      sections[section].map(expense => {
        return dataSource.push({ expense, key: `expense-${expense.id}` });
      });
      return null;
    });

    return (
      <Pane>
        <hr />
        {this.addExpenseLink(budgetItemExpenses, this.newExpenseHandler)}
        <Table
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '25', '50'],
            showSizeChanger: true,
          }}
          size="small"
          title={() => `Expenses for ${this.props.budgetItem.name}`}
          bordered
          locale={{ emptyText: "You haven't added any expenses yet" }}
          columns={this.columns}
        />
      </Pane>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    newExpense: id => {
      dispatch(newExpense(id));
    },
  }),
)(BudgetItemExpenseList);
