import React, { Component } from 'react';
import PropTypes from 'prop-types';

// API
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  PastExpensesRequest,
} from '@shared/api/budget-item-expenses';

// Components
import Form, { validationMessages } from 'components/Form';
import DateSelect from 'components/DateSelect';
import { Autocomplete, Dialog, TextInputField } from 'evergreen-ui';

// Helpers
import { notice, error } from 'window';

// Form
import { Formik } from 'formik';
import * as Yup from 'yup';

const expenseValidations = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .min(0.01, 'Amount must be at least $0.01')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
});

class ExpenseForm extends Component {
  static propTypes = {
    expense: PropTypes.shape({
      id: PropTypes.number,
      budgetItemId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
    unselectExpense: PropTypes.func.isRequired,
    createdExpense: PropTypes.func.isRequired,
    updateExpense: PropTypes.func.isRequired,
  };

  state = {
    predictions: [],
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

  handleSubmit = (values, { setSubmitting }) => {
    const expense = {
      ...values,
      id: this.props.expense.id,
      budgetItemId: this.props.expense.budgetItemId,
    };

    if (expense.id) {
      this.updateExpense(expense, setSubmitting);
    } else {
      this.createExpense(expense, setSubmitting);
    }
  };

  createExpense = async (expense, setSubmitting) => {
    try {
      const resp = await CreateExpenseRequest(expense);
      if (resp && resp.ok) {
        this.props.createdExpense(resp.budgetItemExpense);
        notice('Expense Saved');
        this.props.unselectExpense();
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  updateExpense = async (expense, setSubmitting) => {
    try {
      const resp = await UpdateExpenseRequest(expense);
      if (resp && resp.ok) {
        this.props.updateExpense(resp.budgetItemExpense);
        notice('Expense Saved');
        this.props.unselectExpense();
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  onCloseComplete = reset => {
    reset();
    this.props.unselectExpense();
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
    const { visible, expense } = this.props;
    const title = expense.id ? 'Edit Expense' : 'Create Expense';
    const confirmLabel = expense.id ? 'Update Expense' : 'Create Expense';

    return (
      <Dialog
        preventBodyScrolling
        isShown={visible}
        title={title}
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
          <Autocomplete
            title="Past Expenses"
            defaultValue={values.name}
            onChange={value => {
              handleChange({ target: { name: 'name', value } });
            }}
            items={this.state.predictions}
          >
            {props => {
              const { getInputProps, getRef } = props;
              return (
                <TextInputField
                  label="Name"
                  name="name"
                  required
                  onBlur={handleBlur}
                  placeholder="Life Insurance"
                  innerRef={getRef}
                  {...getInputProps({
                    value: values.name,
                    onChange: e => {
                      handleChange(e);
                      this.onAutocompleteChange(e.target.value);
                    },
                  })}
                  {...validationMessages(errors.name, touched.name)}
                />
              );
            }}
          </Autocomplete>
          <TextInputField
            type="number"
            name="amount"
            label="Amount"
            required
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(10.00)"
            {...validationMessages(errors.amount, touched.amount)}
          />
          <DateSelect
            label="Date"
            name="date"
            required
            defaultValue={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            {...validationMessages(errors.date, touched.date)}
          />
        </Form>
      </Dialog>
    );
  };

  render() {
    const { expense } = this.props;
    if (expense === null) {
      return null;
    }

    return (
      <Formik
        initialValues={expense}
        onSubmit={this.handleSubmit}
        validationSchema={expenseValidations}
        render={this.renderForm}
      />
    );
  }
}

export default ExpenseForm;
