import React, { Component } from 'react';

// Components
import BudgetItemList from '../BudgetItemList';
import Progress from 'components/Progress';
import { Dialog, Alert, Text, Heading, Pane, Button } from 'evergreen-ui';

// Helpers
import { ImportCategoryRequest } from '@shared/api/budgets';
import { notice, error } from 'window';
import { monthName, currencyf, reduceSum } from '@shared/helpers';
import './budget-category.css';

class BudgetCategory extends Component {
  state = {
    importing: false,
    importConfirmationVisible: false,
  };

  importPreviousItems = async () => {
    this.setState({ importing: true });

    try {
      const resp = await ImportCategoryRequest(
        this.props.currentBudgetCategory.id,
      );
      if (resp && resp.ok) {
        this.props.importedBudgetItems(resp.budgetItems);
        notice(resp.message);
      }
    } catch {
      error('Something went wrong');
    } finally {
      this.setState({ importing: false, importConfirmationVisible: false });
    }
  };

  emptyList(hasBudgetItems, isLoading) {
    if (!hasBudgetItems && !isLoading) {
      return (
        <p className="text-center">You haven't added any budget items yet.</p>
      );
    }
  }

  percentSpent = (budgeted, spent) => {
    const p = (spent / budgeted) * 100;
    if (p > 99.99) {
      return 100;
    }

    if (isNaN(p)) {
      return 0;
    }

    return parseInt(p, 10);
  };

  lastMonth = () => {
    const previousMonth =
      this.props.budget.month === 1 ? 12 : this.props.budget.month - 1;
    return monthName(previousMonth);
  };

  render() {
    const { importing, importConfirmationVisible } = this.state;
    const items = this.props.budgetItems.filter(item => {
      return item.budgetCategoryId === this.props.currentBudgetCategory.id;
    });
    const itemIds = items.map(i => i.id);
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return itemIds.includes(e.budgetItemId);
    });

    const spent = reduceSum(expenses);
    const budgeted = reduceSum(items);
    const remaining = budgeted - spent;
    const percentSpent = this.percentSpent(budgeted, spent);

    const budgetCategory = this.props.currentBudgetCategory;

    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }

    const previousMonth = this.lastMonth();

    return (
      <Pane marginRight="1.5rem" marginLeft="1.5rem">
        <Pane
          display="flex"
          padding={8}
          border="muted"
          marginBottom={8}
          borderRadius={3}
          alignItems="center"
        >
          <Pane flex={1} alignItems="center" display="flex">
            <span
              className={`category-card-header category-card-header-${budgetCategory.name
                .toLowerCase()
                .replace('/', '-')}`}
            />
            <Heading marginLeft={8} size={600}>
              {budgetCategory.name}
            </Heading>
          </Pane>
          <Pane>
            <Button
              iconBefore="import"
              onClick={() => {
                this.setState({ importConfirmationVisible: true });
              }}
            >
              Copy {previousMonth} Items
            </Button>
            <Dialog
              preventBodyScrolling
              width={350}
              hasHeader={false}
              isConfirmLoading={importing}
              confirmLabel={`Copy ${previousMonth} Items`}
              onConfirm={this.importPreviousItems}
              onCloseComplete={() => {
                this.setState({ importConfirmationVisible: false });
              }}
              isShown={importConfirmationVisible}
            >
              <Alert intent="none" title="Copy Budget Items">
                <Text>
                  Do you want to copy budget items from {previousMonth}?
                </Text>
              </Alert>
            </Dialog>
          </Pane>
        </Pane>

        <Pane border="muted" padding={16}>
          <Pane>
            <Pane marginBottom={16} display="flex" flexDirection="column">
              <Pane
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <h3>Spent: {currencyf(spent)}</h3>
                <h3>Remaining: {currencyf(remaining)}</h3>
              </Pane>
              <Progress
                strokeWidth={20}
                status={status}
                percent={percentSpent}
              />
            </Pane>
            <BudgetItemList />
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default BudgetCategory;
