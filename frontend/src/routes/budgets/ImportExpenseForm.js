import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { importedExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Components
import { Row, Col, Icon, Select, Button } from 'antd';

// Helpers
import { notice, error } from 'window';
import moment from 'moment';

class ImportExpenseForm extends Component {
  state = {
    categoryId: '',
    itemId: '',
  };

  disabled = () => {
    return this.state.itemId === '' || this.state.categoryId === '';
  };

  formatExpense = () => {
    return {
      budgetItemId: parseInt(this.state.itemId, 10),
      amount: this.props.expense[this.props.headers.amount].replace('-', ''),
      date: moment(
        this.props.expense[this.props.headers.date],
        'MM-DD-YYYY',
      ).format('YYYY-MM-DD'),
      name: this.props.expense[this.props.headers.name]
        .replace(/\s+/g, ' ')
        .trim(),
    };
  };

  save = async () => {
    if (!this.disabled()) {
      try {
        const expense = this.formatExpense();
        const resp = await CreateExpenseRequest(expense);
        if (!!resp.errors) {
          error('Something went wrong');
        } else {
          notice(`Saved Expense`);
          this.props.removeExpense(this.props.index);
          this.props.importedExpense(resp.budgetItemExpense);
          this.setState({
            categoryId: '',
            itemId: '',
          });
        }
      } catch (err) {
        error(err.message);
      }
    }
  };

  filterOption(input, option) {
    return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  handleCategoryChange = categoryId => {
    this.setState({ categoryId, itemId: '' });
  };

  handleItemChange = itemId => {
    this.setState({ itemId });
  };

  skip = () => {
    this.props.removeExpense(this.props.index);
    this.setState({
      categoryId: '',
      itemId: '',
    });
  };

  possibleDuplicate = () => {
    let possible = false;
    const expense = this.formatExpense();

    this.props.budgetItemExpenses.map(e => {
      const matches =
        e.name === expense.name &&
        e.amount === parseFloat(expense.amount) &&
        e.date === expense.date;

      if (matches) {
        possible = true;
      }
      return true;
    });

    if (possible) {
      const style = {
        color: '#ffd27e',
        padding: '2px',
        fontSize: '26px',
        display: 'block',
      };
      return (
        <span title="Possible Duplicate">
          <Icon type="exclamation-circle" style={style} />
        </span>
      );
    }
  };

  render() {
    const disabled = this.disabled();
    const possibleDuplicate = this.possibleDuplicate();
    return (
      <div>
        <Row>
          <Col span={16}>
            <Select
              showSearch
              style={{ width: '200px', marginBottom: '5px' }}
              placeholder="Select Category"
              optionFilterProp="children"
              value={this.state.categoryId}
              onChange={this.handleCategoryChange}
              filterOption={this.filterOption}
            >
              {this.props.budgetCategories.map((category, i) => {
                return (
                  <Select.Option key={i} value={`${category.id}`}>
                    {category.name}
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              showSearch
              style={{ width: '200px' }}
              placeholder="Select Item"
              value={this.state.itemId}
              optionFilterProp="children"
              onChange={this.handleItemChange}
              filterOption={this.filterOption}
            >
              {this.props.budgetItems
                .filter(
                  item =>
                    String(item.budgetCategoryId) === this.state.categoryId,
                )
                .map((item, i) => {
                  return (
                    <Select.Option key={i} value={`${item.id}`}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <span style={{ marginRight: '5px' }}>
                <Button
                  onClick={this.save}
                  type="primary"
                  disabled={disabled}
                  shape="circle"
                  icon="plus"
                />
              </span>
              <span title="Skip importing">
                <Button
                  onClick={this.skip}
                  type="warning"
                  shape="circle"
                  icon="forward"
                />
              </span>
              {possibleDuplicate}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.budget,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    importedExpense: budgetItemExpense => {
      dispatch(importedExpense(budgetItemExpense));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportExpenseForm);
