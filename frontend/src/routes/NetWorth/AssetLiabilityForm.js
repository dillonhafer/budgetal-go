import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  createAssetLiability,
  updateAssetLiability,
} from 'actions/net-worth-assets';

import Form, { validationMessages } from 'components/Form';
import { TextInputField, Dialog } from 'evergreen-ui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { notice, error } from 'window';

const assetsLiabilityValidations = (names = []) =>
  Yup.object().shape({
    name: Yup.string()
      .test(
        'name',
        'Name must be unique',
        (name = '') => !names.includes(name.trim().toLowerCase()),
      )
      .required('Name is required'),
  });

class AssetLiabilityForm extends Component {
  persistItem = async (item, strategyFunc, setSubmitting) => {
    const title = item.isAsset ? 'ASSET' : 'LIABILITY';

    strategyFunc(item)
      .then(() => {
        notice(`${title} SAVED`);
      })
      .catch(() => {
        error(`COULD NOT SAVE ${title}`);
      })
      .finally(() => {
        setSubmitting(false);
        this.props.close();
      });
  };

  handleSubmit = (values, { setSubmitting }) => {
    const item = {
      ...this.props.item,
      name: values.name,
    };

    const strategy = item.id
      ? this.props.updateAssetLiability
      : this.props.createAssetLiability;
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
    const itemType = item.isAsset ? 'Asset' : 'Liability';
    const confirmLabel = item.id ? `Update ${itemType}` : `Create ${itemType}`;

    return (
      <Dialog
        preventBodyScrolling
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
            label="Name"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            placeholder="(IRA)"
            {...validationMessages(errors.name, touched.name)}
          />
        </Form>
      </Dialog>
    );
  };

  render() {
    if (this.props.item === null) {
      return null;
    }

    const names = [...this.props.assets, ...this.props.liabilities].reduce(
      (acc, item) => {
        if (item.name === this.props.item.name) {
          return acc;
        }
        return [...acc, item.name.toLowerCase()];
      },
      [],
    );

    return (
      <Formik
        initialValues={this.props.item}
        onSubmit={this.handleSubmit}
        validationSchema={assetsLiabilityValidations(names)}
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
    createAssetLiability: item => dispatch(createAssetLiability(item)),
    updateAssetLiability: item => dispatch(updateAssetLiability(item)),
  }),
)(AssetLiabilityForm);
