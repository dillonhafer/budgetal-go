import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import { monthName, currencyf } from 'helpers';

class MonthModal extends Component {
  state = {
    visible: false,
  };

  open = () => {
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { month } = this.props;
    const columns = ['Name', 'Amount'].map(title => {
      return {
        title: (
          <div style={{ textAlign: title === 'Amount' ? 'right' : 'left' }}>
            {title}
          </div>
        ),
        key: title.toLowerCase(),
        dataIndex: title.toLowerCase(),
      };
    });

    const assets = month.assets.map(m => {
      return {
        key: m.id,
        name: <span>{m.name}</span>,
        amount: <div style={{ textAlign: 'right' }}>{currencyf(m.amount)}</div>,
      };
    });

    const liabilities = month.liabilities.map(m => {
      return {
        key: m.id,
        name: <span>{m.name}</span>,
        amount: <div style={{ textAlign: 'right' }}>{currencyf(m.amount)}</div>,
      };
    });

    return (
      <Modal
        title={`${month.name} for ${monthName(month.number)} ${month.year}`}
        width={400}
        visible={visible}
        onCancel={this.close}
        footer={null}
      >
        <h3>Assets</h3>
        <Table
          dataSource={assets}
          pagination={false}
          size="middle"
          columns={columns}
          locale={{ emptyText: 'No Assets' }}
        />
        <br />
        <h3>Liabilities</h3>
        <Table
          dataSource={liabilities}
          pagination={false}
          size="middle"
          columns={columns}
          locale={{ emptyText: 'No Liabilties' }}
        />
      </Modal>
    );
  }
}

export default MonthModal;
