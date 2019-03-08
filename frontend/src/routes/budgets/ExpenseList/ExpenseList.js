import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import ExpenseRow from './ExpenseRow';
import { Button, Heading, Icon, Pane, Table, Text } from 'evergreen-ui';

// Helpers
import { find, groupBy, orderBy } from 'lodash';
import moment from 'moment';

class ExpenseList extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }),
    budgetItem: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
    }).isRequired,
    budgetItemExpenses: PropTypes.array,
    selectExpense: PropTypes.func.isRequired,
  };

  newExpenseHandler = e => {
    e.preventDefault();
    const today = new Date().getDate();
    const date = [
      this.props.budget.year,
      `0${this.props.budget.month}`.slice(-2),
      today,
    ].join('-');

    this.props.selectExpense({
      name: '',
      amount: 0.0,
      date,
      budgetItemId: this.props.budgetItem.id,
    });
  };

  addExpenseLink(expenses, newFunction) {
    const disabled =
      !this.props.budgetItem.id ||
      find(expenses, expense => expense.id === null) !== undefined;
    return (
      <Button
        appearance="primary"
        onClick={newFunction}
        iconBefore="add"
        disabled={disabled}
      >
        Add an Expense
      </Button>
    );
  }

  render() {
    const budgetItemExpenses = this.props.budgetItemExpenses.filter(e => {
      return e.budgetItemId === this.props.budgetItem.id;
    });

    const sections = groupBy(
      orderBy(budgetItemExpenses, ['date', 'id'], ['desc', 'desc']),
      'date',
    );

    const sectionDates = Object.keys(sections);

    return (
      <Pane>
        <Pane
          display="flex"
          padding={16}
          background="tint2"
          marginBottom={16}
          borderRadius={3}
        >
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>
              Expenses for {this.props.budgetItem.name}
            </Heading>
          </Pane>
          <Pane>
            {this.addExpenseLink(budgetItemExpenses, this.newExpenseHandler)}
          </Pane>
        </Pane>

        <Pane
          display={sectionDates.length > 0 ? 'none' : 'flex'}
          padding={16}
          border="muted"
          marginBottom={16}
          borderRadius={3}
        >
          <Pane
            flex={1}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <Icon icon="dollar" marginRight={4} />
            <Text>There are no expenses yet</Text>
          </Pane>
        </Pane>

        <Table
          background="white"
          display={sectionDates.length > 0 ? '' : 'none'}
          border="muted"
          borderRadius="3"
        >
          <Table.Head accountForScrollbar>
            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
            <Table.TextHeaderCell flexGrow={1} flexBasis={300}>
              Name
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Amount</Table.TextHeaderCell>
            <Table.TextHeaderCell />
          </Table.Head>
          <Table.VirtualBody height={500}>
            {sectionDates.map(section => {
              return (
                <React.Fragment key={section}>
                  <Table.Head accountForScrollbar>
                    <Table.TextHeaderCell flexBasis={300} flexGrow={1}>
                      {moment(section, 'YYYY-MM-DD').format(
                        'dddd - MMM DD, YYYY',
                      )}
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell />
                    <Table.TextHeaderCell />
                    <Table.TextHeaderCell />
                  </Table.Head>
                  <Table.Body>
                    {sections[section].map(expense => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </Table.Body>
                </React.Fragment>
              );
            })}
          </Table.VirtualBody>
        </Table>
      </Pane>
    );
  }
}

export default ExpenseList;
