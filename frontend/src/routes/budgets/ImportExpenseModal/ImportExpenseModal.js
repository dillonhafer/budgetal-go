import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Papa from 'papaparse';
import { currencyf } from '@shared/helpers';
import moment from 'moment';
import { groupBy } from 'lodash';

import ImportRow from './ImportRow';
import ImportField from './ImportField';
import { Alert, Dialog, Pane, Spinner, Table, Text } from 'evergreen-ui';

const initialState = {
  parsing: false,
  parsingComplete: false,
  rows: [],
  csvError: '',
  headers: {},
};

class ImportExpenseModal extends PureComponent {
  static propTypes = {
    budgetCategories: PropTypes.array.isRequired,
    budgetItems: PropTypes.array.isRequired,
    budgetItemExpenses: PropTypes.array.isRequired,
    hidden: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
  };

  state = initialState;

  _itemLength = 0;
  _options = [];

  options = () => {
    if (
      this._options.length === 0 ||
      this._itemLength !== this.props.budgetItems.length
    ) {
      const groups = groupBy(this.props.budgetItems, 'budgetCategoryId');
      this._itemLength = this.props.budgetItems.length;
      this._options = this.props.budgetCategories.map(c => ({
        label: c.name,
        options: groups[`${c.id}`],
      }));
    }

    return this._options;
  };

  close = async () => {
    return Promise.resolve().then(() => {
      this.setState(initialState);
      this.props.cancel();
    });
  };

  errors = () => {
    if (this.state.csvError.length) {
      return <Alert intent="danger" title={this.state.csvError} />;
    }
  };

  removeExpense = row => {
    this.setState({
      rows: this.state.rows.filter(r => r.id !== row.id),
    });
  };

  findHeaderIndices = headerRow => {
    const headers = {};
    headers.date = headerRow.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('date');
    });
    headers.name = headerRow.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('description');
    });
    headers.amount = headerRow.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('amount');
    });

    headers.found = true;
    return headers;
  };

  parseFile = file => {
    let headers = {};
    const rows = [];
    if (file !== undefined) {
      this.setState({ rows: [], parsing: true, parsingComplete: false });
      Papa.parse(file, {
        skipEmptyLines: true,
        step: row => {
          if (headers.found) {
            const id = rows.length;
            const date = moment(row.data[0][headers.date], 'MM-DD-YYYY').format(
              'YYYY-MM-DD',
            );
            const name = row.data[0][headers.name].replace(/\s+/g, ' ').trim();
            const amount = currencyf(
              Math.abs(parseFloat(row.data[0][headers.amount])),
            );
            const intent = 'none';

            const expense = { id, date, name, amount, intent };
            this.props.budgetItemExpenses.forEach(e => {
              const matches =
                e.name === expense.name &&
                currencyf(e.amount) === expense.amount &&
                e.date === expense.date;

              if (matches) {
                expense.intent = 'warning';
              }
            });

            rows.push(expense);
          } else {
            headers = this.findHeaderIndices(row.data[0]);
          }
        },
        complete: () => {
          if (
            headers.date === -1 ||
            headers.name === -1 ||
            headers.amount === -1
          ) {
            this.setState({
              parsing: false,
              rows: [],
              csvError: 'Invalid Headers',
            });
          } else {
            setTimeout(() => {
              this.setState({
                parsing: false,
                parsingComplete: true,
                headers,
                rows,
              });
            }, 500);
          }
        },
        error: () => {
          this.setState({ parsing: false });
        },
      });
    } else {
      this.setState({ parsing: false });
    }
  };

  render() {
    const { parsingComplete, rows, parsing } = this.state;

    const width = rows.length > 0 ? 900 : 400;
    const showTable = parsingComplete && rows.length > 0;
    const display =
      parsing || (parsingComplete && showTable) ? 'none' : 'block';

    return (
      <Dialog
        preventBodyScrolling
        title="Import Expenses"
        isShown={this.props.hidden}
        width={width}
        hasFooter={false}
        onCloseComplete={this.close}
      >
        <Pane className="choose-file-container">
          {parsing && !parsingComplete && (
            <Pane marginY={16}>
              <Pane textAlign="center" marginY={56}>
                <Spinner marginX="auto" />
                <Text marginY={16}>Parsing Expenses...</Text>
              </Pane>
            </Pane>
          )}
          {showTable && (
            <Table>
              <Table.Head accountForScrollbar>
                <Table.TextHeaderCell
                  flexBasis={100}
                  flexShrink={0}
                  flexGrow={0}
                >
                  Date
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                <Table.TextHeaderCell
                  flexBasis={100}
                  flexShrink={0}
                  flexGrow={0}
                >
                  Amount
                </Table.TextHeaderCell>
                <Table.TextHeaderCell
                  flexBasis={250}
                  flexShrink={0}
                  flexGrow={0}
                />
              </Table.Head>
              <Table.Body>
                {rows.map(row => (
                  <ImportRow
                    row={row}
                    options={this.options()}
                    onRemove={this.removeExpense}
                    key={`tx-${row.id}`}
                  />
                ))}
              </Table.Body>
            </Table>
          )}

          <ImportField
            display={display}
            error={this.state.csvError}
            parseCSV={this.parseFile}
          />
        </Pane>
      </Dialog>
    );
  }
}

export default ImportExpenseModal;
