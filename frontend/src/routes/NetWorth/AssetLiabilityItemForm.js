import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  createNetWorthItem,
  updateNetWorthItem,
} from 'actions/net-worth-items';

import Form, { AmountInputField, validationMessages } from 'components/Form';
import { SelectField, Dialog } from 'evergreen-ui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { notice, error } from 'window';

const assetsLiabilityItemValidations = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Amount must be at least $1.00')
    .required('Amount is required'),
});

class AssetLiabilityItemForm extends Component {
  persistItem = async (item, strategyFunc, setSubmitting) => {
    strategyFunc(item)
      .then(() => {
        notice(`ITEM SAVED`);
      })
      .catch(() => {
        error(`COULD NOT SAVE ITEM`);
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

    if (!item.id) {
      item.assetId = parseInt(values.assetId, 10);
    }

    const { year, month } = this.props;
    const strategy = item.id
      ? this.props.updateNetWorthItem
      : this.props.createNetWorthItem;
    this.persistItem({ year, month, item }, strategy, setSubmitting);
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
          {!this.props.item.id && (
            <SelectField
              value={values.assetId}
              name="assetId"
              label="Asset"
              width="100%"
              onChange={handleChange}
              onBlur={handleBlur}
              {...validationMessages(errors.assetId, touched.assetId)}
            >
              {this.props.options.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectField>
          )}
          <AmountInputField
            values={values}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
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
  state => ({
    assets: state.netWorth.assets,
    liabilities: state.netWorth.liabilities,
  }),
  dispatch => ({
    createNetWorthItem: ({ year, month, item }) =>
      dispatch(createNetWorthItem({ year, month, item })),
    updateNetWorthItem: ({ item }) => dispatch(updateNetWorthItem({ item })),
  }),
)(AssetLiabilityItemForm);
