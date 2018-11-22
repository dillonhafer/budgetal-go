import React, { Component } from 'react';
import { notice } from 'window';
import {
  CreateAnnualBudgetItemRequest,
  UpdateAnnualBudgetItemRequest,
} from '@shared/api/annual-budget-items';

// Redux
import { connect } from 'react-redux';
import { itemAdded, itemUpdated } from 'actions/annual-budget-items';

import Form from 'components/Form';
import {
  TextInputField,
  Pane,
  SelectField,
  Switch,
  Dialog,
} from 'evergreen-ui';

class AnnualBudgetItemForm extends Component {
  state = {
    loading: false,
    budgetItem: this.props.budgetItem,
  };

  createItem = async item => {
    this.setState({ loading: true });
    try {
      const resp = await CreateAnnualBudgetItemRequest({
        ...item,
        year: this.props.budgetItem.year,
      });
      if (resp && resp.ok) {
        this.props.itemAdded(resp.annualBudgetItem);
        notice(`Created ${item.name}`);
      }
    } catch (err) {
      //ignore for now
    } finally {
      this.setState({ loading: false });
    }
  };

  updateItem = async item => {
    this.setState({ loading: true });
    try {
      const resp = await UpdateAnnualBudgetItemRequest(item);
      if (resp && resp.ok) {
        this.props.itemUpdated(resp.annualBudgetItem);
        notice(`Updated ${item.name}`);
      }
    } catch (err) {
      //ignore for now
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const item = {
      ...this.state.budgetItem,
      id: this.props.budgetItem.id,
      interval: parseInt(this.state.budgetItem.interval, 10),
      annualBudgetId: this.props.budgetItem.annualBudgetId,
    };

    if (item.id) {
      this.updateItem(item);
    } else {
      this.createItem(item);
    }
  };

  render() {
    const { budgetItem, loading } = this.state;
    const { visible, onCancel } = this.props;
    const confirmLabel = budgetItem.id ? 'Update Item' : 'Create Item';
    return (
      <Dialog
        isShown={visible}
        title="Annual Budget Item"
        width={350}
        onCloseComplete={onCancel}
        isConfirmLoading={loading}
        cancelText="Close"
        onConfirm={this.handleSubmit}
        confirmLabel={confirmLabel}
      >
        <Form onSubmit={this.handleSubmit}>
          <TextInputField
            required
            label="Name"
            onChange={e => {
              this.setState({
                budgetItem: { ...budgetItem, name: e.target.value },
              });
            }}
            placeholder="Life Insurance"
            isInvalid={budgetItem.name && budgetItem.name.trim().length <= 0}
          />
          <TextInputField
            type="number"
            required
            min="1"
            label="Amount"
            onChange={e => {
              this.setState({
                budgetItem: { ...budgetItem, amount: e.target.value },
              });
            }}
            placeholder="(10.00)"
            isInvalid={budgetItem.amount <= 0}
          />
          <TextInputField
            required
            type="date"
            label="Due Date"
            onChange={dueDate => {
              this.setState({
                budgetItem: {
                  ...budgetItem,
                  dueDate: dueDate.format('YYYY-mm-dd'),
                },
              });
            }}
            placeholder="2018-08-23"
            isInvalid={
              budgetItem.dueDate && budgetItem.dueDate.trim().length <= 0
            }
          />

          <SelectField label="Months" width="100%">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </SelectField>
          <Pane display="flex" justifyContent="flex-end">
            <label>Paid?</label>
            <Switch
              onChange={e => {
                this.setState({
                  budgetItem: { ...budgetItem, paid: e.target.checked },
                });
              }}
              height={32}
            />
          </Pane>
        </Form>
      </Dialog>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    itemUpdated: item => {
      dispatch(itemUpdated(item));
    },
    itemAdded: item => {
      dispatch(itemAdded(item));
    },
  }),
)(AnnualBudgetItemForm);
