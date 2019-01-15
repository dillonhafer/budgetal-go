import React, { Component } from 'react';

// Components
import ImportExpenseModal from '../ImportExpenseModal';
import { Pane, Select, Button } from 'evergreen-ui';
import { Menu } from 'antd';

// Helpers
import times from 'lodash/times';
import { availableYears, monthName } from '@shared/helpers';

class Sidebar extends Component {
  state = {
    showImportExpenseModal: false,
  };

  handleOnClick = (item, key, keyPath) => {
    if (item.key === 'import-csv') {
      this.setState({ showImportExpenseModal: true });
    } else {
      const cat = this.props.budgetCategories.find(cat => {
        return cat.name === item.key;
      });
      if (cat !== undefined) {
        const lowerName = cat.name.toLowerCase().replace('/', '-');
        window.location.hash = `#${lowerName}`;
        this.props.changeCategory(cat);
      }
    }
  };

  findDisabledDate(date) {
    const year = date.year();
    return year < 2015 || year > new Date().getFullYear() + 3;
  }

  hideImportExpenseModal = () => {
    this.setState({ showImportExpenseModal: false });
  };

  handleOnDateChange = e => {
    const date = {
      year: this.props.year,
      month: this.props.month,
      [e.target.name]: e.target.value,
    };

    this.props.history.push(`/budgets/${date.year}/${date.month}`);
  };

  render() {
    const { showImportExpenseModal } = this.state;
    const { month, year } = this.props;

    return (
      <div className="icon-bar">
        <Menu
          theme="light"
          style={{ width: '100%' }}
          onClick={this.handleOnClick}
          selectedKeys={[this.props.currentBudgetCategory.name]}
          mode="inline"
        >
          <Menu.Item disabled={true} key="date">
            <Pane>
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
          </Menu.Item>
          {this.props.budgetCategories.map(category => {
            const itemClass = category.name.toLowerCase().replace('/', '-');
            return (
              <Menu.Item id={category.id} key={category.name}>
                <span className={itemClass}>{category.name}</span>
              </Menu.Item>
            );
          })}
          <Menu.Item id={'import-csv'} key={'import-csv'}>
            <Button iconBefore="import">Import Expenses</Button>
          </Menu.Item>
        </Menu>
        <ImportExpenseModal
          budgetItems={this.props.budgetItems}
          budgetCategories={this.props.budgetCategories}
          budgetItemExpenses={this.props.budgetItemExpenses}
          hidden={showImportExpenseModal}
          cancel={this.hideImportExpenseModal}
        />
      </div>
    );
  }
}

export default Sidebar;
