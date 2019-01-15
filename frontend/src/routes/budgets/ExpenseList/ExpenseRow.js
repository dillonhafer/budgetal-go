import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { removeExpense, selectExpense } from 'actions/budget-item-expenses';

// API
import { DeleteExpenseRequest } from '@shared/api/budget-item-expenses';

// Components
import DeleteConfirmation from 'components/DeleteConfirmation';
import {
  Text,
  Strong,
  IconButton,
  Menu,
  Popover,
  Position,
  Table,
} from 'evergreen-ui';

// Helpers
import moment from 'moment';
import { notice, error } from 'window';
import { currencyf } from '@shared/helpers';

class ExpenseRow extends Component {
  static propTypes = {
    expense: PropTypes.shape({
      id: PropTypes.number.isRequired,
      budgetItemId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
    selectExpense: PropTypes.func.isRequired,
    removeExpense: PropTypes.func.isRequired,
  };

  state = {
    showDeleteConfirmation: false,
    isDeleting: false,
  };

  deleteExpense = async () => {
    const { expense } = this.props;
    this.setState({ isDeleting: true });

    try {
      const resp = await DeleteExpenseRequest(expense.id);
      if (resp && resp.ok) {
        this.deleted = true;
      }
      notice('Expense deleted');
    } catch {
      error('Something went wrong');
    } finally {
      this.setState({ isDeleting: false, showDeleteConfirmation: false });
    }
  };

  render() {
    const { expense } = this.props;
    return (
      <React.Fragment>
        <Table.Row>
          <Table.TextCell>
            {moment(expense.date, 'YYYY-MM-DD').format('MMM D, YYYY')}
          </Table.TextCell>
          <Table.TextCell flexGrow={1} flexBasis={300}>
            {expense.name}
          </Table.TextCell>
          <Table.TextCell isNumber>{currencyf(expense.amount)}</Table.TextCell>
          <Table.TextCell align="right">
            <Popover
              position={Position.BOTTOM_LEFT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item
                      icon="edit"
                      onSelect={() => {
                        this.props.selectExpense(expense);
                      }}
                    >
                      Edit
                    </Menu.Item>
                  </Menu.Group>
                  <Menu.Divider />
                  <Menu.Group>
                    <Menu.Item
                      icon="trash"
                      intent="danger"
                      onSelect={() => {
                        this.setState({ showDeleteConfirmation: true });
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <IconButton appearance="minimal" icon="more" />
            </Popover>
          </Table.TextCell>
        </Table.Row>

        <DeleteConfirmation
          title={`Are you sure?`}
          message={
            <Text display="block">
              <Text>
                Are you sure you want to delete this expense? This cannot be
                undone.
              </Text>
              <Text display="block" marginTop={8}>
                <Strong>{expense.name}</Strong>
              </Text>
            </Text>
          }
          isShown={this.state.showDeleteConfirmation}
          isConfirmLoading={this.state.isDeleting}
          onConfirm={this.deleteExpense}
          onCloseComplete={() => {
            this.setState({ showDeleteConfirmation: false });
            if (this.deleted) {
              this.props.removeExpense(expense);
            }
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    selectExpense: expense => dispatch(selectExpense(expense)),
    removeExpense: id => dispatch(removeExpense(id)),
  }),
)(ExpenseRow);
