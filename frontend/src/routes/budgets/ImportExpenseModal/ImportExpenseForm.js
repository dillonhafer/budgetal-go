import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { importedExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Components
import { Pane, IconButton, Tooltip, Popover, Menu, Button } from 'evergreen-ui';

// Helpers
import { notice, error } from 'window';

class ImportExpenseForm extends PureComponent {
  state = {
    categoryId: null,
    itemId: null,
    loading: false,
  };

  static propTypes = {
    options: PropTypes.array.isRequired,
  };

  disabled = () => {
    return this.state.itemId === null || this.state.categoryId === null;
  };

  save = async () => {
    this.setState({ loading: true });
    const expense = this.props.expense;
    if (!this.disabled()) {
      try {
        const resp = await CreateExpenseRequest({
          budgetItemId: this.state.itemId,
          date: expense.date,
          name: expense.name,
          amount: expense.amount.replace('$', ''),
        });
        if (!!resp.errors) {
          error('Something went wrong');
          this.setState({ loading: false });
        } else {
          notice(`Saved Expense`);
          this.props.removeExpense(expense);
          this.props.importedExpense(resp.budgetItemExpense);
        }
      } catch (err) {
        error(err.message);
        this.setState({ loading: false });
      }
    }
  };

  skip = () => {
    this.setState({ loading: true });
    this.props.removeExpense(this.props.expense);
  };

  onChange = ids => {
    const [categoryId, itemId] = ids;
    this.setState({ categoryId, itemId });
  };

  render() {
    const disabled = this.disabled() || this.state.loading;
    return (
      <Pane style={{ display: 'flex', flexDirection: 'row' }}>
        <Pane>
          <Popover
            content={({ close }) => (
              <Pane
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                <Pane display={this.state.categoryId ? 'none' : 'block'}>
                  <Menu>
                    {this.props.options.categories.map(o => (
                      <Menu.Item
                        onSelect={e => {
                          this.setState({ categoryId: o.id });
                        }}
                        key={o.id}
                      >
                        {o.name}
                      </Menu.Item>
                    ))}
                  </Menu>
                </Pane>
                <Pane display={this.state.categoryId ? 'block' : 'none'}>
                  <Menu>
                    <Menu.Item
                      icon="arrow-left"
                      onSelect={() => {
                        this.setState({ categoryId: null, itemId: null });
                      }}
                    >
                      back
                    </Menu.Item>
                    <Menu.OptionsGroup
                      title="Budget Items"
                      options={this.props.options.items
                        .filter(
                          o => o.budgetCategoryId === this.state.categoryId,
                        )
                        .map(o => ({
                          label: o.name,
                          value: o.id,
                        }))}
                      selected={this.state.itemId}
                      onChange={itemId => {
                        this.setState({ itemId });
                        close();
                      }}
                    />
                  </Menu>
                </Pane>
              </Pane>
            )}
          >
            <Button width={100} textAlign="center">
              {(this.state.itemId &&
                this.props.options.items.find(i => i.id === this.state.itemId)
                  .name) ||
                'Budget Item'}
            </Button>
          </Popover>
        </Pane>
        <Pane marginX={8}>
          <IconButton
            icon="plus"
            intent="success"
            appearance="primary"
            onClick={this.save}
            disabled={disabled}
          />
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
