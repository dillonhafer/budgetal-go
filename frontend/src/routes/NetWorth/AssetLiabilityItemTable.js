import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { deleteNetWorthItem } from 'actions/net-worth-items';

import { IconButton, Menu, Popover, Position, Table } from 'evergreen-ui';
import PropTypes from 'prop-types';
import { currencyf } from '@shared/helpers';
import { notice, error } from 'window';

// Components
import AssetLiabilityItemForm from './AssetLiabilityItemForm';
import DeleteConfirmation from './DeleteConfirmation';

class AssetLiabilityItemTable extends Component {
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
    assetLiabilityFormVisible: false,
  };

  handleOnDelete = item => {
    this.setState({
      showDeleteConfirmation: true,
      assetLiabilityFormVisible: false,
      item,
    });
  };

  handleOnDeleteConfirm = item => {
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
    this.setState({
      item,
      showDeleteConfirmation: false,
      assetLiabilityFormVisible: true,
    });
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
                            onSelect={() => this.handleOnDelete(item)}
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
            this.handleOnDeleteConfirm(this.state.item);
          }}
          onCloseComplete={() => {
            this.setState({
              showDeleteConfirmation: false,
              item: null,
            });
          }}
        />
        <AssetLiabilityItemForm
          item={this.state.item}
          visible={this.state.assetLiabilityFormVisible}
          onCancel={() => this.setState({ item: null })}
          close={() => this.setState({ assetLiabilityFormVisible: false })}
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
)(AssetLiabilityItemTable);
