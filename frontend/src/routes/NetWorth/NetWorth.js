import React, { Component } from 'react';

import { title } from 'window';
import { availableYears, monthName } from 'helpers';
import { Spin, Select } from 'antd';
import Graphchart from 'graphchart';
import moment from 'moment';
import MonthModal from './MonthModal';

const Option = Select.Option;

class NetWorth extends Component {
  componentDidMount() {
    const year = this.props.match.params.year;
    title(`${year} | Net Worth`);
    this.loadNetWorthItems({ year });
  }

  state = {
    selectedMonth: {
      name: '',
      number: 1,
      year: this.props.match.params.year,
      assets: [],
      liabilities: [],
    },
  };

  loadNetWorthItems = ({ year }) => {
    this.props.loadNetWorthItems({ year });
  };

  changeYear = year => {
    this.props.history.push(`/net-worth/${year}`);
  };

  handleMonthClick = ({ name, month }) => {
    const assets = this.props.months
      .find(m => m.month === month)
      .items.filter(i => i.isAsset)
      .map(i => ({
        id: i.id,
        name: this.props.assets.find(a => a.id === i.assetId).name,
        amount: i.amount,
      }));

    const liabilities = this.props.months
      .find(m => m.month === month)
      .items.filter(i => !i.isAsset)
      .map(i => ({
        id: i.id,
        name: this.props.liabilities.find(a => a.id === i.assetId).name,
        amount: i.amount,
      }));

    this.setState({
      selectedMonth: {
        name,
        number: month,
        year: this.props.match.params.year,
        assets,
        liabilities,
      },
    });

    this.monthModal.open();
  };

  render() {
    const { refreshing, loading, months } = this.props;
    const { year } = this.props.match.params;

    const assetData = months.map(m => ({
      name: `${monthName(m.month)} ${year}`,
      y: m.items.filter(i => i.isAsset).reduce((acc, i) => acc + i.amount, 0),
    }));

    const liabilityData = months.map(m => ({
      name: `${monthName(m.month)} ${year}`,
      y: m.items.filter(i => !i.isAsset).reduce((acc, i) => acc + i.amount, 0),
    }));

    const netWorthData = assetData.map((a, i) => {
      const y = a.y - liabilityData[i].y;
      const future = moment().isBefore(
        `${months[i].year}-${months[i].month}-01`,
      );

      return {
        ...a,
        y: future ? null : y,
      };
    });

    return (
      <div>
        <h1>
          NET WORTH FOR {year}
          <div
            style={{
              float: 'right',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Select
              size="large"
              style={{ width: '100px' }}
              defaultValue={year}
              onChange={this.changeYear}
            >
              {availableYears().map(y => {
                return (
                  <Option key={y} value={y.toString()}>
                    {y}
                  </Option>
                );
              })}
            </Select>
          </div>
        </h1>
        <div style={{ paddingBottom: 25 }}>
          <i>
            *Currently Net Worth can only be modified from the&nbsp;
            <a
              target="_blank"
              style={{ textDecoration: 'underline' }}
              rel="noopener noreferrer"
              href="https://itunes.apple.com/us/app/budgetal-app/id1326525398?mt=8"
            >
              iOS
            </a>
            {' and '}
            <a
              target="_blank"
              style={{ textDecoration: 'underline' }}
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=com.budgetal.app"
            >
              Android
            </a>
            &nbsp;apps
          </i>
        </div>
        <Spin
          delay={300}
          tip="Loading..."
          size="large"
          spinning={loading || refreshing}
        >
          <div>
            <Graphchart
              assets={assetData}
              liabilities={liabilityData}
              netWorth={netWorthData}
              onMonthClick={this.handleMonthClick}
            />
            <MonthModal
              ref={monthModal => (this.monthModal = monthModal)}
              month={this.state.selectedMonth}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default NetWorth;
