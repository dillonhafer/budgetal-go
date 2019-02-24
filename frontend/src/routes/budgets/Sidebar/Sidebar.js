import React, { Component } from 'react';

// Components
import ImportExpenseModal from '../ImportExpenseModal';
import { Pane, Select, Menu } from 'evergreen-ui';

// Helpers
import times from 'lodash/times';
import { availableYears, monthName } from '@shared/helpers';
import CategoryMenuItem from './CategoryMenuItem';

class Sidebar extends Component {
  state = {
    showImportExpenseModal: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showImportExpenseModal !== nextState.showImportExpenseModal
    ) {
      return true;
    }
    if (this.props.currentBudgetCategory !== nextProps.currentBudgetCategory) {
      return true;
    }

    return false;
  }

  handleOnSelect = category => {
    const lowerName = category.name.toLowerCase().replace('/', '-');
    this.props.history.push(`#${lowerName}`);
    this.props.changeCategory(category);
  };

  changeDate = async ({ name, value }) => {
    return Promise.resolve().then(() => {
      const date = {
        year: this.props.year,
        month: this.props.month,
        [name]: value,
      };

      this.props.history.push(`/budgets/${date.year}/${date.month}`);
    });
  };

  handleOnDateChange = async e => {
    this.props.startLoading();
    return this.changeDate(e.target);
  };

  render() {
    const { showImportExpenseModal } = this.state;
    const { month, year, budgetCategories, currentBudgetCategory } = this.props;

    return (
      <Pane borderRight="1px solid #E4E7EB">
        <Menu>
          <Menu.Group title="Budget">
            <Pane role="menuitem" textAlign="center">
              <Select
                value={month}
                name="month"
                onChange={this.handleOnDateChange}
                flex="unset"
                width={90}
                marginRight={4}
              >
                {times(12, i => (
                  <option key={i} value={i + 1}>
                    {monthName(i + 1)}
                  </option>
                ))}
              </Select>
              <Select
                value={year}
                name="year"
                onChange={this.handleOnDateChange}
                flex="unset"
                width={70}
              >
                {availableYears().map(y => {
                  return (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  );
                })}
              </Select>
            </Pane>
          </Menu.Group>
        </Menu>
        <Menu>
          <Menu.Divider />
          <Menu.Group
            title="Budget Categories"
            selected={currentBudgetCategory.name}
          >
            {budgetCategories.map(category => {
              const isSelected = currentBudgetCategory.name === category.name;
              return (
                <CategoryMenuItem
                  key={category.name}
                  category={category}
                  onSelect={this.handleOnSelect}
                  isSelected={isSelected}
                />
              );
            })}
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group title="Import">
            <Menu.Item
              onSelect={() => {
                this.setState({ showImportExpenseModal: true });
              }}
              icon="import"
              intent="none"
            >
              Import Expenses
            </Menu.Item>
          </Menu.Group>
        </Menu>
        <ImportExpenseModal
          budgetItems={this.props.budgetItems}
          budgetCategories={this.props.budgetCategories}
          budgetItemExpenses={this.props.budgetItemExpenses}
          hidden={showImportExpenseModal}
          cancel={() => {
            this.setState({ showImportExpenseModal: false });
          }}
        />
      </Pane>
    );
  }
}

export default Sidebar;
