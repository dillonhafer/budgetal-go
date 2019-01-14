import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  updateBudgetItem,
  updateNullBudgetItem,
  removeBudgetItem,
} from 'actions/budgets';

// Components
import BudgetItemExpenseList from './BudgetItemExpenseList';

// API
import {
  CreateItemRequest,
  UpdateItemRequest,
  DeleteItemRequest,
} from '@shared/api/budget-items';

// Helpers
import classNames from 'classnames';
import { currencyf, reduceSum } from '@shared/helpers';
import { notice, error } from 'window';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import ProgressCircle from 'components/Progress/Circle';
import DeleteConfirmation from 'components/DeleteConfirmation';
import { colors } from '@shared/theme';
import { Pane, Button, Icon, Spinner } from 'evergreen-ui';

const FormItem = Form.Item;

class BudgetItem extends Component {
  state = {
    loading: false,
    showDeleteConfirmation: false,
    isDeleting: false,
  };

  updateAmount = amount => {
    const updatedItem = Object.assign({}, this.props.budgetItem, {
      amount: String(amount).replace(/\$\s?|(,*)/g, ''),
    });
    this.props.updateBudgetItem(updatedItem);
  };

  amountSpent = () => {
    return reduceSum(
      this.props.budgetItemExpenses.filter(
        e => e.budgetItemId === this.props.budgetItem.id,
      ),
    );
  };

  persistBudgetItem = async budgetItem => {
    try {
      this.setState({ loading: true });
      const isPersisted = budgetItem.id !== null;
      const strategy = isPersisted ? UpdateItemRequest : CreateItemRequest;
      const resp = await strategy(budgetItem);

      if (resp && resp.ok) {
        if (budgetItem.id === null) {
          this.props.updateNullBudgetItem(resp.budgetItem);
        }
        notice(`Saved ${resp.budgetItem.name}`);
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      this.setState({ loading: false });
    }
  };

  save = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.persistBudgetItem(this.props.budgetItem);
      }
    });
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

  remainingClass(amountRemaining) {
    return classNames({
      'success-color': amountRemaining > 0,
      'alert-color': amountRemaining < 0,
      blue: Math.abs(currencyf(amountRemaining, '')) === 0,
    });
  }

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
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
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
        <Row>
          <Col span={8}>
            <Form layout="horizontal" onSubmit={this.save}>
              <FormItem {...formItemLayout} label="Name">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Name is required',
                    },
                  ],
                })(<Input name="name" placeholder="Name" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="Amount">
                {getFieldDecorator('amount', {
                  rules: [
                    {
                      type: 'number',
                      min: 1,
                      required: true,
                      message: 'Amount is required',
                    },
                  ],
                })(
                  <InputNumber
                    name="amount"
                    min={1}
                    placeholder="(1.00)"
                    formatter={value =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />,
                )}
              </FormItem>
              <Pane marginBottom={16} textAlign="right">
                <Button
                  appearance="primary"
                  height={40}
                  disabled={this.state.loading}
                >
                  {this.state.loading && <Spinner size={16} marginRight={8} />}
                  Save
                </Button>
              </Pane>
            </Form>
          </Col>
          <Col span={16}>
            <Row type="flex" align="middle" justify="center">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div className="text-center">
                  <ProgressCircle
                    size="lg"
                    color={color}
                    percent={percent}
                    text={text}
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <p className="text-center">
                  You have spent <b>{currencyf(this.amountSpent())}</b> of{' '}
                  <b>{currencyf(item.amount)}</b>.
                </p>
                <p className="text-center">{msg}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <BudgetItemExpenseList budgetItem={item} />
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

const formProps = {
  mapPropsToFields: props => {
    return {
      name: { value: props.budgetItem.name },
      amount: { value: props.budgetItem.amount },
    };
  },
  onFieldsChange: (props, fields) => {
    if (fields.hasOwnProperty('amount')) {
      props.updateBudgetItem({
        ...props.budgetItem,
        amount: fields['amount'].value,
      });
    }

    if (fields.hasOwnProperty('name')) {
      props.updateBudgetItem({
        ...props.budgetItem,
        name: fields['name'].value,
      });
    }
  },
};

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    updateBudgetItem: income => {
      dispatch(updateBudgetItem(income));
    },
    updateNullBudgetItem: item => {
      dispatch(updateNullBudgetItem(item));
    },
    removeBudgetItem: item => {
      dispatch(removeBudgetItem(item));
    },
  }),
)(Form.create(formProps)(BudgetItem));
