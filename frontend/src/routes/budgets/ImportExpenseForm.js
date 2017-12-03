import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { importedExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Components
import { Row, Col, Icon, Cascader, Button } from 'antd';

// Helpers
import { notice, error } from 'window';
import moment from 'moment';

class ImportExpenseForm extends Component {
  state = {
    categoryId: null,
    itemId: null,
  };

  disabled = () => {
    return this.state.itemId === null || this.state.categoryId === null;
  };

  formatExpense = () => {
    return {
      budgetItemId: this.state.itemId,
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
        }
      } catch (err) {
        error(err.message);
      }
    }
  };

  skip = () => {
    this.props.removeExpense(this.props.index);
    this.setState({
      categoryId: null,
      itemId: null,
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
        fontSize: '27px',
        alignItems: 'flex-start',
        verticalAlign: 'top',
        backgroundColor: 'white',
        borderRadius: '50%',
      };
      return (
        <span title="Possible Duplicate" style={{ marginRight: '5px' }}>
          <Icon type="exclamation-circle" style={style} />
        </span>
      );
    }
  };

  onChange = ids => {
    const [categoryId, itemId] = ids;
    this.setState({ categoryId, itemId });
  };

  render() {
    const disabled = this.disabled();
    const possibleDuplicate = this.possibleDuplicate();
    const options = this.props.budgetCategories
      .map(cat => {
        const items = this.props.budgetItems.filter(
          i => i.budgetCategoryId === cat.id,
        );
        return {
          value: cat.id,
          label: cat.name,
          children: items.map(i => {
            return {
              value: i.id,
              label: i.name,
            };
          }),
        };
      })
      .filter(c => c.children.length > 0);
    return (
      <div>
        <Row>
          <Col span={14}>
            <Cascader
              options={options}
              onChange={this.onChange}
              placeholder="Please select"
            />
          </Col>
          <Col span={10}>
            <div className="text-center">
              {possibleDuplicate}
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
