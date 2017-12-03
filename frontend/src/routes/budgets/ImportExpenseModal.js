import React, { Component } from 'react';
import { Modal, Upload, Icon, Progress, Table } from 'antd';
import Papa from 'papaparse';
import { currencyf } from 'helpers';
import ImportExpenseForm from './ImportExpenseForm';
const Dragger = Upload.Dragger;

const initialState = {
  parsing: false,
  rows: [],
  csvError: undefined,
  headers: {},
};

class ImportExpenseModal extends Component {
  state = initialState;

  close = () => {
    this.setState({ ...initialState });
    this.props.cancel();
  };

  errors = () => {
    const { csvError } = this.state;
    if (csvError !== undefined) {
      return <p className="alert-color">{csvError}</p>;
    }
  };

  removeExpense = index => {
    this.setState({
      rows: [
        ...this.state.rows.slice(0, index),
        ...this.state.rows.slice(index + 1),
      ],
    });
  };

  parseFile = ({ file }) => {
    if (file !== undefined) {
      this.setState({ rows: [], parsing: true });
      Papa.parse(file, {
        skipEmptyLines: true,
        step: row => {
          if (this.state.rows.length === 0) {
            this.setState({ rows: [['rowId', ...row.data[0]]] });
          } else {
            this.setState({
              rows: [
                ...this.state.rows,
                [this.state.rows.length, ...row.data[0]],
              ],
            });
          }
        },
        complete: (results, file) => {
          let headers = {};
          headers.rowId = this.state.rows[0].findIndex(col => {
            return col === 'rowId';
          });
          headers.date = this.state.rows[0].findIndex(col => {
            return col
              .toLowerCase()
              .trim()
              .includes('date');
          });
          headers.name = this.state.rows[0].findIndex(col => {
            return col
              .toLowerCase()
              .trim()
              .includes('description');
          });
          headers.amount = this.state.rows[0].findIndex(col => {
            return col
              .toLowerCase()
              .trim()
              .includes('amount');
          });

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
            this.setState({ parsing: false, headers });
          }
        },
        error: (error, file) => {
          this.setState({ parsing: false });
        },
      });
    } else {
      this.setState({ parsing: false });
    }
  };

  csvTable = () => {
    const { headers } = this.state;
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 100,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 75,
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        width: 300,
      },
    ];

    const data = this.state.rows
      .map((row, index) => {
        if (index !== 0) {
          return {
            key: `tx-${row[headers.rowId]}`,
            date: row[headers.date],
            name: row[headers.name],
            amount: currencyf(Math.abs(parseFloat(row[headers.amount]))),
            action: (
              <ImportExpenseForm
                expense={row}
                index={index}
                removeExpense={this.removeExpense}
                headers={this.state.headers}
              />
            ),
          };
        }
        return undefined;
      })
      .filter(row => row !== undefined);

    return (
      <div>
        <Table
          editable={true}
          size="middle"
          bordered={true}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  };

  content() {
    if (this.state.parsing) {
      return (
        <div className="parsing-file">
          <p className="primary-color">Parsing File</p>
          <Progress percent={100} status="active" showInfo={false} />
        </div>
      );
    } else if (this.state.rows.length) {
      return this.csvTable();
    }
  }

  render() {
    const width = this.state.rows.length > 0 ? 900 : 400;
    const style = width === 400 ? {} : { display: 'none' };
    return (
      <Modal
        title="Import Expenses"
        visible={this.props.hidden}
        width={width}
        footer={null}
        onOk={this.close}
        onCancel={this.close}
      >
        <div className="choose-file-container">
          {this.content()}
          <div style={style}>
            <div style={{ marginTop: 16, height: 180 }}>
              <Dragger
                accept=".csv"
                showUploadList={false}
                customRequest={this.parseFile}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Click or drag csv file to upload
                </p>
                <br />
                <p className="ant-upload-hint">
                  {this.errors()}
                  File should have 3 headers: <br />
                  <b>date, description, amount</b>
                </p>
              </Dragger>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ImportExpenseModal;
