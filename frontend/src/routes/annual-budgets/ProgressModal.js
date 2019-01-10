import React, { Component } from 'react';

import { currencyf } from '@shared/helpers';
import { times, round } from 'lodash';
import moment from 'moment';

import { Pane, Table, Icon, Dialog } from 'evergreen-ui';

export default class ProgressModal extends Component {
  render() {
    const { item, visible } = this.props;
    const startDate = moment(item.dueDate).subtract(
      item.interval + 1,
      'months',
    );
    const month = round(item.amount / item.interval);
    const title = `Accumulation Progress for ${item.name}`;

    return (
      <Dialog
        title={title}
        isShown={visible}
        hasFooter={false}
        preventBodyScrolling
        onCloseComplete={this.props.hideProgress}
        onCancel={this.props.hideProgress}
      >
        <Table>
          <Table.Head accountForScrollbar>
            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
            <Table.TextHeaderCell>Amount</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {times(item.interval, key => {
              const date = startDate.add(1, 'months').format('LL');
              const badgeStatus =
                moment().diff(startDate) > 0 ? 'green' : 'red';
              return (
                <Table.Row key={`${key}`}>
                  <Table.TextCell>
                    <Pane display="flex" alignItems="center">
                      <Icon
                        icon="full-circle"
                        color={badgeStatus}
                        size={12}
                        marginRight={8}
                      />
                      {date}
                    </Pane>
                  </Table.TextCell>
                  <Table.TextCell isNumber>
                    {currencyf(month * (key + 1))}
                  </Table.TextCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Dialog>
    );
  }
}
