import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { importedExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from '@shared/api/budget-item-expenses';

// Components
import {
  Button,
  Icon,
  IconButton,
  Pane,
  Select,
  Spinner,
  Tooltip,
} from 'evergreen-ui';

// Helpers
import { notice, error } from 'window';
import { cleanCurrencyString } from '@shared/helpers';

class ImportExpenseForm extends PureComponent {
  state = {
    itemId: 0,
    loading: false,
  };

  static propTypes = {
    options: PropTypes.array.isRequired,
  };

  disabled = () => {
    return this.state.itemId === 0;
  };

  save = () => {
    this.setState({ loading: true });
    const expense = this.props.expense;
    if (!this.disabled()) {
      CreateExpenseRequest({
        budgetItemId: this.state.itemId,
        date: expense.date,
        name: expense.name,
        amount: cleanCurrencyString(expense.amount),
      })
        .then(resp => {
          if (!!resp.errors) {
            error('Something went wrong');
            this.setState({ loading: false });
          } else {
            notice(`Saved Expense`);
            this.props.removeExpense(expense);
            this.props.importedExpense(resp.budgetItemExpense);
          }
        })
        .catch(err => {
          error(err.message);
          this.setState({ loading: false });
        });
    }
  };

  skip = () => {
    this.setState({ loading: true });
    this.props.removeExpense(this.props.expense);
  };

  render() {
    const disabled = this.disabled() || this.state.loading;
    return (
      <Pane style={{ display: 'flex', flexDirection: 'row' }}>
        <Pane>
          <Pane>
            <Select
              width={140}
              value={this.state.itemId}
              onChange={e => {
                this.setState({ itemId: parseInt(e.target.value, 10) });
              }}
            >
              <option value="0">Choose Item:</option>
              {this.props.options.reduce((acc, cat) => {
                if (cat.options) {
                  return [
                    ...acc,
                    <optgroup key={cat.label} label={cat.label}>
                      {cat.options.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </optgroup>,
                  ];
                }

                return acc;
              }, [])}
            </Select>
          </Pane>
        </Pane>
        <Pane marginX={8}>
          <Button
            intent="success"
            appearance="primary"
            onClick={this.save}
            disabled={disabled}
            paddingLeft={8}
            paddingRight={8}
          >
            {this.state.loading ? <Spinner size={16} /> : <Icon icon="plus" />}
          </Button>
        </Pane>
        <Pane>
          <Tooltip content="Skip Importing">
            <IconButton appearance="minimal" icon="cross" onClick={this.skip} />
          </Tooltip>
        </Pane>
      </Pane>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    importedExpense: budgetItemExpense => {
      dispatch(importedExpense(budgetItemExpense));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(ImportExpenseForm);
