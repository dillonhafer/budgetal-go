import React, { Component } from 'react';
import { notice, error } from 'window';
import {
  CreateAnnualBudgetItemRequest,
  UpdateAnnualBudgetItemRequest,
} from '@shared/api/annual-budget-items';

// Redux
import { connect } from 'react-redux';
import { itemAdded, itemUpdated } from 'actions/annual-budget-items';

import Form, { validationMessages } from 'components/Form';
import {
  TextInputField,
  Pane,
  SelectField,
  Switch,
  Dialog,
} from 'evergreen-ui';
import DateSelect from 'components/DateSelect';
import { Formik } from 'formik';
import * as Yup from 'yup';

const budgetItemValidations = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .min(1, 'Amount must be at least $1.00')
    .required('Amount is required'),
  dueDate: Yup.date().required('Due Date is required'),
  interval: Yup.number()
    .min(1, 'Interval must be 1-12')
    .max(12, 'Interval must be 1-12')
    .required('Interval is required'),
});

class AnnualBudgetItemForm extends Component {
  createItem = async (item, setSubmitting) => {
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
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  updateItem = async (item, setSubmitting) => {
    try {
      const resp = await UpdateAnnualBudgetItemRequest(item);
      if (resp && resp.ok) {
        this.props.itemUpdated(resp.annualBudgetItem);
        notice(`Updated ${item.name}`);
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  handleSubmit = (values, { setSubmitting }) => {
    const item = {
      ...values,
      interval: parseInt(values.interval, 10),
      id: this.props.budgetItem.id,
      annualBudgetId: this.props.budgetItem.annualBudgetId,
    };

    if (item.id) {
      this.updateItem(item, setSubmitting);
    } else {
      this.createItem(item, setSubmitting);
    }
  };

  onCloseComplete = reset => {
    reset();
    this.props.onCancel();
  };

  renderForm = ({
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  }) => {
    const { visible, budgetItem } = this.props;
    const confirmLabel = budgetItem.id ? 'Update Item' : 'Create Item';

    return (
      <Dialog
        preventBodyScrolling
        isShown={visible}
        title="Annual Budget Item"
        width={350}
        onCloseComplete={() => {
          this.onCloseComplete(handleReset);
        }}
        isConfirmLoading={isSubmitting}
        cancelText="Close"
        onConfirm={handleSubmit}
        confirmLabel={isSubmitting ? 'Loading...' : confirmLabel}
      >
        <Form onSubmit={handleSubmit}>
          <TextInputField
            label="Name"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            placeholder="Life Insurance"
            {...validationMessages(errors.name, touched.name)}
          />
          <TextInputField
            type="number"
            name="amount"
            label="Amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(10.00)"
            {...validationMessages(errors.amount, touched.amount)}
          />
          <DateSelect
            label="Due Date"
            name="dueDate"
            required
            defaultValue={values.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            {...validationMessages(errors.dueDate, touched.dueDate)}
          />
          <SelectField
            value={values.interval}
            name="interval"
            label="Months"
            width="100%"
            onChange={handleChange}
            onBlur={handleBlur}
            {...validationMessages(errors.interval, touched.interval)}
          >
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
            <Switch
              name="paid"
              label="Months"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values.paid}
              height={32}
            />
          </Pane>
        </Form>
      </Dialog>
    );
  };

  render() {
    if (this.props.budgetItem === null) {
      return null;
    }

    return (
      <Formik
        initialValues={this.props.budgetItem}
        onSubmit={this.handleSubmit}
        validationSchema={budgetItemValidations}
        render={this.renderForm}
      />
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
