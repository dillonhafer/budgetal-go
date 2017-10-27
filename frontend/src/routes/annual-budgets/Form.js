import React, { Component } from 'react';
import {
  CreateAnnualBudgetItemRequest,
  UpdateAnnualBudgetItemRequest,
} from 'api/annual-budget-items';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Row from 'antd/lib/row';
import InputNumber from 'antd/lib/input-number';
import DatePicker from 'antd/lib/date-picker';
import Switch from 'antd/lib/switch';
import Modal from 'antd/lib/modal';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class AnnualBudgetItemForm extends Component {
  createItem = async item => {
    try {
      const resp = await CreateAnnualBudgetItemRequest({
        ...item,
        year: this.props.budgetItem.year,
      });
      if (resp && resp.ok) {
        this.props.afterSubmit(resp.annualBudgetItem);
      }
    } catch (err) {
      //ignore for now
    }
  };

  updateItem = async item => {
    try {
      const resp = await UpdateAnnualBudgetItemRequest(item);
      if (resp && resp.ok) {
        this.props.afterSubmit(resp.annualBudgetItem);
      }
    } catch (err) {
      //ignore for now
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const item = {
          ...values,
          id: this.props.budgetItem.id,
          interval: parseInt(values.interval, 10),
        };
        if (item.id) {
          this.updateItem(item);
        } else {
          this.createItem(item);
        }
      } else {
        console.log(err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onCancel, budgetItem } = this.props;
    const okText = budgetItem.id ? 'Update Item' : 'Create Item';
    return (
      <Modal
        title="Annual Budget Item"
        width={300}
        visible={visible}
        okText={okText}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...layout} hasFeedback label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Name is required' }],
            })(<Input placeholder="Life Insurance" />)}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Amount">
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
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                name="amount"
                style={{ width: '100%' }}
                min={1}
                placeholder="(10.00)"
              />,
            )}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Due Date">
            {getFieldDecorator('dueDate', {
              rules: [{ required: true, message: 'Date is required' }],
            })(
              <DatePicker
                onChange={this.handleOnChange}
                size="large"
                allowClear={false}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
              />,
            )}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Months">
            {getFieldDecorator('interval', {})(
              <Select>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3</Select.Option>
                <Select.Option value="4">4</Select.Option>
                <Select.Option value="5">5</Select.Option>
                <Select.Option value="6">6</Select.Option>
                <Select.Option value="7">7</Select.Option>
                <Select.Option value="8">8</Select.Option>
                <Select.Option value="9">9</Select.Option>
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="11">11</Select.Option>
                <Select.Option value="12">12</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Row type="flex" justify="end">
            <Form.Item {...layout}>
              {getFieldDecorator('paid', {
                valuePropName: 'checked',
              })(<Switch checkedChildren="paid" unCheckedChildren="paid" />)}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapPropsToFields = props => {
  const item = props.budgetItem;
  return Object.keys(item).reduce((acc, k) => {
    return { ...acc, [k]: { value: item[k] } };
  }, {});
};

export default Form.create({ mapPropsToFields })(AnnualBudgetItemForm);
