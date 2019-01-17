import React, { Component } from 'react';

// Components
import ExpenseList from '../ExpenseList';
import BudgetItemForm from './BudgetItemForm';

// API
import { DeleteItemRequest } from '@shared/api/budget-items';

// Helpers
import { currencyf, reduceSum } from '@shared/helpers';
import { notice, error } from 'window';

import ProgressCircle from 'components/Progress/Circle';
import DeleteConfirmation from 'components/DeleteConfirmation';
import { colors } from '@shared/theme';
import { Pane, Button, Icon } from 'evergreen-ui';

class BudgetItem extends Component {
  state = {
    loading: false,
    showDeleteConfirmation: false,
    isDeleting: false,
  };

  amountSpent = () => {
    return reduceSum(
      this.props.budgetItemExpenses.filter(
        e => e.budgetItemId === this.props.budgetItem.id,
      ),
    );
  };

  deleteBudgetItem = async () => {
    this.setState({ isDeleting: true });
    try {
      if (this.props.budgetItem.id !== null) {
        const resp = await DeleteItemRequest(this.props.budgetItem.id);
        if (resp !== null) {
          notice('Deleted ' + this.props.budgetItem.name);
        }
      }

      this.props.removeBudgetItem(this.props.budgetItem);
    } catch (err) {
      error('Something went wrong');
    } finally {
      this.setState({ isDeleting: false, showDeleteConfirmation: false });
    }
  };

  onDeleteClick = e => {
    e.preventDefault();
    this.props.deleteBudgetItem(this.props.budgetItem);
  };

  handleDeleteClick = e => {
    e.preventDefault();
    this.setState({ showDeleteConfirmation: true });
  };

  percentSpent = () => {
    const p = (this.amountSpent() / this.props.budgetItem.amount) * 100;

    if (p > 99.99) {
      return 100;
    }

    if (isNaN(p)) {
      return 0;
    }

    return parseInt(p, 10);
  };

  render() {
    const item = this.props.budgetItem;
    const deleteFunction =
      item.id !== null
        ? this.handleDeleteClick
        : () => {
            this.props.removeBudgetItem(item);
          };

    const amountRemaining = item.amount - this.amountSpent();
    const percent = this.percentSpent();
    let msg = `You have ${currencyf(amountRemaining)} remaining to spend.`;
    let text = `${percent}%`;
    let color = colors.primary;
    if (amountRemaining < 0) {
      color = colors.error;
      text = <Icon size={32} icon="cross" />;
      msg = `You have overspent by ${currencyf(Math.abs(amountRemaining))}`;
    } else if (amountRemaining === 0.0) {
      color = colors.success;
      text = <Icon size={32} icon="tick" />;
    }

    return (
      <div>
        <Pane display="flex" flexDirection="row" alignItems="center">
          <Pane width={300}>
            <BudgetItemForm
              budgetItem={this.props.budgetItem}
              updateBudgetItem={this.props.updateBudgetItem}
              itemUpdated={this.props.updateBudgetItem}
              itemAdded={this.props.updateNullBudgetItem}
            />
          </Pane>
          <Pane width="100%">
            <Pane
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Pane>
                <div className="text-center">
                  <ProgressCircle
                    size="lg"
                    color={color}
                    percent={percent}
                    text={text}
                  />
                </div>
              </Pane>
              <Pane>
                <p className="text-center">
                  You have spent <b>{currencyf(this.amountSpent())}</b> of{' '}
                  <b>{currencyf(item.amount)}</b>.
                </p>
                <p className="text-center">{msg}</p>
              </Pane>
            </Pane>
          </Pane>
        </Pane>

        <ExpenseList budgetItem={item} />

        <Pane textAlign="right" margin={8}>
          <Button onClick={deleteFunction} intent="danger" iconBefore="trash">
            Delete {item.name}
          </Button>
          <DeleteConfirmation
            title={`Delete ${this.props.budgetItem.name}`}
            message={`
              Are you sure you want to delete ${
                this.props.budgetItem.name
              }? This cannot be undone.`}
            isShown={this.state.showDeleteConfirmation}
            isConfirmLoading={this.state.isDeleting}
            onConfirm={() => {
              this.deleteBudgetItem(this.props.budgetItem);
            }}
            onCloseComplete={() => {
              this.setState({ showDeleteConfirmation: false });
            }}
          />
        </Pane>
      </div>
    );
  }
}

export default BudgetItem;
