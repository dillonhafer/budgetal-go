import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ImportExpenseModal from './ImportExpenseModal';
import { updateBudgetCategory } from 'actions/budgets';

import { Menu, DatePicker, Button } from 'antd';

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

  render() {
    const { showImportExpenseModal } = this.state;
    const { month, year, onChange } = this.props;
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
            <DatePicker.MonthPicker
              onChange={onChange}
              format={'MMMM YYYY'}
              allowClear={false}
              value={moment([year, month].join('/'), 'YYYY/M')}
              disabledDate={this.findDisabledDate}
              cellContentRender={date => {
                return date;
              }}
            />
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
            <Button icon="upload" type="primary">
              Import Expenses
            </Button>
          </Menu.Item>
        </Menu>
        <ImportExpenseModal
          hidden={showImportExpenseModal}
          cancel={this.hideImportExpenseModal}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(Sidebar);
