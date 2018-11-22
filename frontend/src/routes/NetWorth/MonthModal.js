import React, { Component } from 'react';
import { monthName } from '@shared/helpers';
import { error } from 'window';
import { Alert, Dialog, Heading, Text } from 'evergreen-ui';
import AssetTable from './AssetTable';

class MonthModal extends Component {
  state = {
    loading: false,
    visible: false,
    confirmationVisible: false,
  };

  lastMonth = () => {
    const previousMonth =
      this.props.month.number === 1 ? 12 : this.props.month.number - 1;
    return monthName(previousMonth);
  };

  importNetWorthItems = () => {
    this.setState({ loading: true, confirmationVisible: false });
    this.props
      .importNetWorthItems({
        year: this.props.month.year,
        month: this.props.month.number,
      })
      .then(() => {
        this.close();
        this.setState({ loading: false });
      })
      .catch(() => {
        error(`Could not import`);
        this.setState({ loading: false });
        this.close();
      });
  };

  onImportPress = () => {
    this.setState({ confirmationVisible: true });
  };

  open = () => {
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false, confirmationVisible: false });
  };

  render() {
    const { visible, loading, confirmationVisible } = this.state;
    const { month } = this.props;

    return (
      <Dialog
        isShown={visible}
        title={`${month.name} for ${monthName(month.number)} ${month.year}`}
        onCloseComplete={this.close}
        isConfirmLoading={loading}
        cancelText="Close"
        onConfirm={this.onImportPress}
        confirmLabel={`Copy ${this.lastMonth()} Items`}
      >
        <Heading marginBottom={16}>Assets</Heading>
        <AssetTable items={month.assets} emptyText="No Assets" />

        <Heading marginTop={16} marginBottom={16}>
          Liabilities
        </Heading>
        <AssetTable items={month.liabilities} emptyText="No Liabilities" />
        <Dialog
          width={350}
          hasHeader={false}
          confirmLabel={`Copy ${this.lastMonth()} Items`}
          onConfirm={this.importNetWorthItems}
          onCloseComplete={() => {
            this.setState({ confirmationVisible: false });
          }}
          isShown={confirmationVisible}
        >
          <Alert intent="none" title="Copy Net Worth Items">
            <Text>
              Do you want copy net worth items from {this.lastMonth()}?
            </Text>
          </Alert>
        </Dialog>
      </Dialog>
    );
  }
}

export default MonthModal;
