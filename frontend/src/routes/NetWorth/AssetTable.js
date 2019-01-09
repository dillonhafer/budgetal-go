import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { deleteNetWorthItem } from 'actions/net-worth-items';

import {
  IconButton,
  Menu,
  Popover,
  Position,
  Table,
  toaster,
} from 'evergreen-ui';
import PropTypes from 'prop-types';
import { currencyf } from '@shared/helpers';
import { notice, error } from 'window';
import DeleteConfirmation from './DeleteConfirmation';

class AssetTable extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        amount: PropTypes.number,
      }),
    ),
    emptyText: PropTypes.string,
  };

  state = {
    isSubmitting: false,
    showDeleteConfirmation: false,
    item: null,
  };

  handleOnDelete = item => {
    this.setState({ isSubmitting: true });

    this.props
      .deleteNetWorthItem(item)
      .then(() => {
        notice(`${item.name} Deleted`);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
          showDeleteConfirmation: false,
          item: null,
        });
      })
      .catch(() => {
        error('Something went wrong');
      });
  };

  handleOnEdit = item => {
    toaster.danger(`${item.name}: Not Implemented Yet`);
  };

  render() {
    const { items, emptyText } = this.props;

    return (
      <React.Fragment>
        <Table>
          <Table.Head accountForScrollbar>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Amount</Table.TextHeaderCell>
            <Table.TextHeaderCell />
          </Table.Head>
          <Table.Body>
            {items.map(item => (
              <Table.Row key={`${item.id}`}>
                <Table.TextCell>{item.name}</Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(item.amount)}
                </Table.TextCell>
                <Table.TextCell align="right">
                  <Popover
                    position={Position.BOTTOM_LEFT}
                    content={
                      <Menu>
                        <Menu.Group>
                          <Menu.Item
                            icon="edit"
                            onSelect={() => this.handleOnEdit(item)}
                          >
                            Change Amount
                          </Menu.Item>
                        </Menu.Group>
                        <Menu.Divider />
                        <Menu.Group>
                          <Menu.Item
                            icon="trash"
                            intent="danger"
                            onSelect={() => {
                              this.setState({
                                showDeleteConfirmation: true,
                                item,
                              });
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Group>
                      </Menu>
                    }
                  >
                    <IconButton appearance="minimal" icon="more" />
                  </Popover>
                </Table.TextCell>
              </Table.Row>
            ))}
            {items.length === 0 && (
              <Table.Row>
                <Table.TextCell>{emptyText}</Table.TextCell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <DeleteConfirmation
          title={`Are you sure?`}
          message={`Do you want to delete ${this.state.item &&
            this.state.item.name}`}
          isShown={this.state.showDeleteConfirmation}
          isConfirmLoading={this.state.isSubmitting}
          onConfirm={() => {
            this.handleOnDelete(this.state.item);
          }}
          onCloseComplete={() => {
            this.setState({
              showDeleteConfirmation: false,
              item: null,
            });
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    deleteNetWorthItem: item => dispatch(deleteNetWorthItem({ item })),
  }),
)(AssetTable);
