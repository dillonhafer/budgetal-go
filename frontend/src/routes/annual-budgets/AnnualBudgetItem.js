import React, { Component } from 'react';

import { currencyf } from 'helpers';
import { colors } from 'window';
import moment from 'moment';
import { round } from 'lodash';

// Antd
import { Col, Card, Tag } from 'antd';

import EditMenu from './EditMenu';

class AnnualBudgetItem extends Component {
  render() {
    const { item } = this.props;
    const { name, loading } = item;
    const month = currencyf(round(item.amount / item.interval));
    const color = item.paid ? colors.success : colors.disabled;

    return (
      <Col className="card" xs={24} sm={12} md={8} lg={8}>
        <Card
          loading={loading}
          noHovering
          title={name}
          extra={<EditMenu item={this.props.item} />}
        >
          <div className="text-center">
            <p>
              In order to reach <b>{currencyf(item.amount)}</b>
              <br />
              by <b>{moment(item.dueDate).format('LL')}</b>
              <br />
              you need to save
              <br />
              <b>{month}/month</b>
              <br />
            </p>
            <Tag color={color}>Paid</Tag>
          </div>
        </Card>
      </Col>
    );
  }
}

export default AnnualBudgetItem;
