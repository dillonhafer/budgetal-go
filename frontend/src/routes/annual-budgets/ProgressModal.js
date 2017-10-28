import React, { Component } from 'react';

import { currencyf } from 'helpers';
import { times, round } from 'lodash';
import moment from 'moment';

// Antd
import Badge from 'antd/lib/badge';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';

export default class ProgressModal extends Component {
  render() {
    const { item, visible } = this.props;
    const startDate = moment(item.dueDate).subtract(
      item.interval + 1,
      'months',
    );
    const month = round(item.amount / item.interval);
    const title = `Accumulation Progress for ${item.name}`;
    const dataSource = times(item.interval, key => {
      const date = startDate.add(1, 'months').format('LL');
      const badgeStatus = moment().diff(startDate) > 0 ? 'success' : 'error';
      return {
        key: key,
        date: (
          <span>
            <Badge status={badgeStatus} /> {date}
          </span>
        ),
        amount: currencyf(month * (key + 1)),
      };
    });

    const columns = ['Date', 'Amount'].map(title => {
      return {
        title,
        key: title.toLowerCase(),
        dataIndex: title.toLowerCase(),
      };
    });

    return (
      <Modal
        title={title}
        visible={visible}
        footer={null}
        onCancel={this.props.hideProgress}
      >
        <Table
          dataSource={dataSource}
          pagination={false}
          size="small"
          columns={columns}
          bordered
        />
      </Modal>
    );
  }
}
