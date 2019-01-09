import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'evergreen-ui';
import ImportExpenseForm from './ImportExpenseForm';

class ImportRow extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
  };

  render() {
    const { row, onRemove } = this.props;
    return (
      <Table.Row intent={row.intent}>
        <Table.TextCell flexBasis={100} flexShrink={0} flexGrow={0}>
          {row.date}
        </Table.TextCell>
        <Table.TextCell>{row.name}</Table.TextCell>
        <Table.TextCell isNumber flexBasis={100} flexShrink={0} flexGrow={0}>
          {row.amount}
        </Table.TextCell>
        <Table.TextCell flexBasis={250} flexShrink={0} flexGrow={0}>
          <ImportExpenseForm
            options={this.props.options}
            expense={row}
            removeExpense={onRemove}
          />
        </Table.TextCell>
      </Table.Row>
    );
  }
}

export default ImportRow;
