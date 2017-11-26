import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { updateIncome } from 'actions/budgets';

// API
import { UpdateIncomeRequest } from 'api/budgets';

// Helpers
import { currencyf } from 'helpers';
import { notice } from 'window';

// Components
import { Form, Button, InputNumber, Modal } from 'antd';

const FormItem = Form.Item;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class BudgetFormModal extends Component {
  state = {
    visible: false,
    loading: false,
  };

  saveIncome = async () => {
    this.setState({ loading: true });
    try {
      const { year, month, income } = this.props.budget;
      const resp = await UpdateIncomeRequest({ year, month, income });
      if (resp && resp.ok) {
        notice('Saved Monthly Income');
      }

      this.setState({ visible: false });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  showIncomeModal = e => {
    e.preventDefault();
    e.target.blur();
    this.setState({
      visible: true,
      originalIncome: this.props.budget.income,
    });
  };

  handleIncomeOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.saveIncome();
      }
    });
  };

  handleIncomeCancel = e => {
    this.props.updateIncome(this.state.originalIncome);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading, visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { budget } = this.props;
    return (
      <div>
        <Button icon="edit" type="primary" onClick={this.showIncomeModal}>
          {currencyf(budget.income)}
        </Button>

        <Modal
          title="Annual Budget Item"
          width={400}
          confirmLoading={loading}
          visible={visible}
          okText={'Update Income'}
          onOk={this.handleIncomeOk}
          onCancel={this.handleIncomeCancel}
        >
          <Form onSubmit={this.handleIncomeOk}>
            <FormItem {...layout} hasFeedback label="Monthly Income">
              {getFieldDecorator('income', {
                rules: [
                  {
                    type: 'number',
                    min: 1,
                    required: true,
                    message: 'Monthly Income is required',
                  },
                ],
              })(
                <InputNumber
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  name="amount"
                  style={{ width: '100%' }}
                  step={100}
                  min={1}
                  placeholder="(3,500.00)"
                />,
              )}
            </FormItem>

            <div style={{ display: 'none' }}>
              <FormItem>
                <Button loading={loading} htmlType="submit" />
              </FormItem>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapPropsToFields = props => {
  return {
    income: { value: props.budget.income },
  };
};

const onFieldsChange = (props, fields) => {
  props.updateIncome(fields.income.value);
};

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    updateIncome: income => {
      dispatch(updateIncome(income));
    },
  }),
)(Form.create({ mapPropsToFields, onFieldsChange })(BudgetFormModal));
