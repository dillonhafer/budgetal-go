import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  createdExpense,
  updateExpense,
  removeExpense,
} from 'actions/budget-item-expenses';

// API
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  DeleteExpenseRequest,
  PastExpensesRequest,
} from 'api/budget-item-expenses';

// Helpers
import moment from 'moment';
import {
  Row,
  Col,
  Button,
  Popconfirm,
  Form,
  InputNumber,
  DatePicker,
  AutoComplete,
} from 'antd';

import { notice } from 'window';
class BudgetItemExpenseForm extends Component {
  state = {
    predictions: [],
    loading: false,
  };

  onAutocompleteChange = name => {
    if (name && name.length > 2) {
      this.predict(name);
    } else {
      this.setState({ predictions: [] });
    }
  };

  predict = async name => {
    const resp = await PastExpensesRequest(name);
    if (resp && resp.ok) {
      this.setState({ predictions: resp.names });
    }
  };

  handleOnSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.persistExpense(this.props.expense);
      }
    });
  };

  persistExpense = async expense => {
    this.setState({ loading: true });
    try {
      if (expense.id === null) {
        await this.createExpense(expense);
      } else {
        await this.updateExpense(expense);
      }
    } catch (err) {
      // err
    } finally {
      this.setState({ loading: false });
    }
  };

  createExpense = async expense => {
    const resp = await CreateExpenseRequest(expense);
    if (resp && resp.ok) {
      this.props.createdExpense(resp.budgetItemExpense);
      notice('Budget Item saved');
    }
  };

  updateExpense = async expense => {
    const resp = await UpdateExpenseRequest(expense);
    if (resp && resp.ok) {
      notice('Budget Item saved');
    }
  };

  deleteExpense = async expense => {
    const resp = await DeleteExpenseRequest(expense.id);
    if (resp && resp.ok) {
      notice('Budget Item deleted');
      this.props.removeExpense(expense);
    }
  };

  handleOnDelete = async () => {
    const { expense } = this.props;
    if (expense.id === null) {
      this.props.removeExpense(expense);
    } else {
      await this.deleteExpense(expense);
    }
  };

  render() {
    const { loading, predictions } = this.state;
    const icon = loading ? 'loading' : 'check';

    return (
      <Row>
        <Form onSubmit={this.handleOnSubmit} layout="inline">
          <Col span={6}>
            <Form.Item>
              {this.props.form.getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <DatePicker
                  size="large"
                  allowClear={false}
                  format={'YYYY-MM-DD'}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item hasFeedback={true}>
              {this.props.form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Name is required',
                  },
                ],
              })(
                <AutoComplete
                  allowClear={true}
                  dataSource={predictions}
                  style={{ width: 200 }}
                  onChange={this.onAutocompleteChange}
                  placeholder="(Rent Payment)"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item hasFeedback={true}>
              {this.props.form.getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    min: 1,
                    message: 'Amount is required',
                  },
                ],
              })(
                <InputNumber
                  min={1}
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="(10.00)"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={3} className="text-right">
            <Form.Item>
              <Button
                onClick={this.handleOnSubmit}
                icon={icon}
                disabled={loading}
                shape="circle"
                type="primary"
                size="default"
                htmlType="submit"
                title="Save Expense"
              />
              <Popconfirm
                arrowPointAtCenter={true}
                title={'Are you sure?'}
                overlayClassName="delete-popover"
                placement="left"
                onConfirm={this.handleOnDelete}
                okText={'Delete Expense'}
                okType={'danger'}
              >
                <Button
                  className="delete-button"
                  shape="circle"
                  type="danger"
                  icon="delete"
                  title="Delete Expense"
                />
              </Popconfirm>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    );
  }
}

const formProps = {
  mapPropsToFields: props => {
    return {
      amount: { ...props.amount, value: props.expense.amount },
      name: { value: props.expense.name },
      date: { value: moment(props.expense.date, 'YYYY-MM-DD') },
    };
  },
  onValuesChange: (props, values) => {
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    }

    props.updateExpense({
      ...props.expense,
      ...values,
    });
  },
};

export default connect(
  state => ({}),
  dispatch => ({
    createdExpense: expense => {
      dispatch(createdExpense(expense));
    },
    updateExpense: expense => {
      dispatch(updateExpense(expense));
    },
    removeExpense: expense => {
      dispatch(removeExpense(expense));
    },
  }),
)(Form.create(formProps)(BudgetItemExpenseForm));
