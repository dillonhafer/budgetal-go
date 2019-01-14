import React, { Component } from 'react';
import PropTypes from 'prop-types';

// API
import { UpdateIncomeRequest } from '@shared/api/budgets';

// Helpers
import { currencyf } from '@shared/helpers';
import { error, notice } from 'window';

// Components
import { Pane, Button, Dialog, TextInputField } from 'evergreen-ui';
import Form, { validationMessages } from 'components/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';

const incomeValidations = Yup.object().shape({
  income: Yup.number()
    .min(1, 'Monthly Income must be at least $1.00')
    .required('Monthly Income is required'),
});

class MonthlyIncomeModal extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
    }).isRequired,
    updateIncome: PropTypes.func.isRequired,
  };

  state = {
    visible: false,
  };

  saveIncome = async ({ income }, { setSubmitting }) => {
    try {
      const { year, month } = this.props.budget;
      const resp = await UpdateIncomeRequest({
        year,
        month,
        income,
      });
      if (resp && resp.ok) {
        this.props.updateIncome(income);
        notice('Saved Monthly Income');
      } else {
        error(resp);
      }

      this.setState({ visible: false });
    } catch (err) {
      error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  renderForm = ({
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    handleReset,
  }) => {
    return (
      <Dialog
        preventBodyScrolling
        isShown={this.state.visible}
        title="Edit Income"
        width={400}
        onCloseComplete={() => {
          this.setState({
            visible: false,
          });
          handleReset();
        }}
        isConfirmLoading={isSubmitting}
        cancelText="Cancel"
        onConfirm={handleSubmit}
        confirmLabel="Update Income"
      >
        <Form onSubmit={handleSubmit}>
          <TextInputField
            type="number"
            name="income"
            label="Monthly Income"
            value={values.income}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(3,500.00)"
            {...validationMessages(errors.income, touched.income)}
          />
        </Form>
      </Dialog>
    );
  };

  render() {
    const { budget } = this.props;
    return (
      <Pane>
        <Button
          height={32}
          appearance="primary"
          onClick={() => {
            this.setState({ visible: true });
          }}
          iconBefore="edit"
        >
          {currencyf(budget.income)}
        </Button>

        {budget.income > 0 && (
          <Formik
            initialValues={budget}
            onSubmit={this.saveIncome}
            validationSchema={incomeValidations}
            render={this.renderForm}
          />
        )}
      </Pane>
    );
  }
}

export default MonthlyIncomeModal;
