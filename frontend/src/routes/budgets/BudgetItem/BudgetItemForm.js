import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import { Pane, Button, Spinner, TextInputField } from 'evergreen-ui';

// Helpers
import { notice, error } from 'window';

// Form
import { CreateItemRequest, UpdateItemRequest } from '@shared/api/budget-items';
import Form, { validationMessages, AmountInputField } from 'components/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

const budgetItemValidations = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .min(0.0, 'Amount must be at least $0.00')
    .required('Amount is required'),
});

class BudgetItemForm extends Component {
  static propTypes = {
    budgetItem: PropTypes.shape({ name: PropTypes.string }),
    updateBudgetItem: PropTypes.func.isRequired,
    itemUpdated: PropTypes.func.isRequired,
    itemAdded: PropTypes.func.isRequired,
  };

  update = async ({ target }) => {
    this.props.updateBudgetItem({
      ...this.props.budgetItem,
      [target.name]: target.value,
    });
  };

  createItem = async (item, setSubmitting) => {
    try {
      const resp = await CreateItemRequest({
        ...item,
        year: this.props.budgetItem.year,
      });
      if (resp && resp.ok) {
        this.props.itemAdded(resp.budgetItem);
        notice(`Saved ${resp.budgetItem.name}`);
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  updateItem = async (item, setSubmitting) => {
    try {
      const resp = await UpdateItemRequest(item);
      if (resp && resp.ok) {
        this.props.itemUpdated(resp.budgetItem);
        notice(`Saved ${resp.budgetItem.name}`);
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
      id: this.props.budgetItem.id,
      budgetCategoryId: this.props.budgetItem.budgetCategoryId,
    };

    if (item.id) {
      this.updateItem(item, setSubmitting);
    } else {
      this.createItem(item, setSubmitting);
    }
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
    return (
      <Form onSubmit={handleSubmit}>
        <TextInputField
          label="Name"
          name="name"
          onChange={e => {
            this.update(e);
            handleChange(e);
          }}
          onBlur={handleBlur}
          value={values.name}
          placeholder="Life Insurance"
          {...validationMessages(errors.name, touched.name)}
        />
        <AmountInputField
          values={values}
          errors={errors}
          touched={touched}
          onBlur={handleBlur}
          onChange={e => {
            this.update(e);
            handleChange(e);
          }}
        />
        <Pane marginBottom={16} textAlign="right">
          <Button appearance="primary" height={36} disabled={isSubmitting}>
            {isSubmitting && <Spinner size={16} marginRight={8} />}
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Pane>
      </Form>
    );
  };

  render() {
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

export default BudgetItemForm;
