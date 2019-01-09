import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  createNetWorthItem,
  updateNetWorthItem,
} from 'actions/net-worth-items';

import Form from 'components/Form';
import { TextInputField, Dialog } from 'evergreen-ui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { notice, error } from 'window';

const assetsLiabilityItemValidations = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Amount must be at least $1.00')
    .required('Amount is required'),
});

const validationMessages = (errors, touched) => {
  return {
    isInvalid: errors && touched,
    validationMessage: touched ? errors : null,
  };
};

class AssetLiabilityItemForm extends Component {
  persistItem = async (item, strategyFunc, setSubmitting) => {
    const name = item.name.toUpperCase();

    strategyFunc(item)
      .then(() => {
        notice(`${name} SAVED`);
      })
      .catch(() => {
        error(`COULD NOT SAVE ${name}`);
      })
      .finally(() => {
        setSubmitting(false);
        this.props.close();
      });
  };

  handleSubmit = (values, { setSubmitting }) => {
    const item = {
      ...this.props.item,
      amount: values.amount,
    };

    const strategy = item.id
      ? this.props.updateNetWorthItem
      : this.props.createNetWorthItem;
    this.persistItem(item, strategy, setSubmitting);
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
    const { visible, item } = this.props;
    const itemType = item.id ? `Edit ${item.name}` : 'New Item';
    const confirmLabel = item.id ? `Update ${item.name}` : `Create Item`;

    return (
      <Dialog
        isShown={visible}
        title={itemType}
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
            type="number"
            name="amount"
            label="Amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(1,000.00)"
            {...validationMessages(errors.amount, touched.amount)}
          />
        </Form>
      </Dialog>
    );
  };

  render() {
    if (this.props.item === null) {
      return null;
    }

    return (
      <Formik
        initialValues={this.props.item}
        onSubmit={this.handleSubmit}
        validationSchema={assetsLiabilityItemValidations}
        render={this.renderForm}
      />
    );
  }
}

export default connect(
  null,
  dispatch => ({
    createNetWorthItem: item => dispatch(createNetWorthItem({ item })),
    updateNetWorthItem: item => dispatch(updateNetWorthItem({ item })),
  }),
)(AssetLiabilityItemForm);
