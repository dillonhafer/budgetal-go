import React, { Component } from 'react';
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

  render() {
    const { items, emptyText } = this.props;

    return (
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
              <Table.TextCell isNumber>{currencyf(item.amount)}</Table.TextCell>
              <Table.TextCell align="right">
                <Popover
                  position={Position.BOTTOM_LEFT}
                  content={
                    <Menu>
                      <Menu.Group title="Actions">
                        <Menu.Item
                          icon="edit"
                          onSelect={() => toaster.danger('Not Implemented Yet')}
                        >
                          Change Amount
                        </Menu.Item>
                      </Menu.Group>
                      <Menu.Divider />
                      <Menu.Group title="Destructive">
                        <Menu.Item
                          icon="trash"
                          intent="danger"
                          onSelect={() => toaster.danger('Not Implemented Yet')}
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
    );
  }
}

export default AssetTable;
