import React, { Component } from 'react';
import { orderBy } from 'lodash';
import { title } from 'window';
import { availableYears, monthName } from 'helpers';
import Graphchart from 'graphchart';
import moment from 'moment';
import MonthModal from './MonthModal';
import {
  Alert,
  Heading,
  Link,
  Pane,
  Text,
  Paragraph,
  Select,
  Spinner,
} from 'evergreen-ui';

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

  changeYear = e => {
    this.props.history.push(`/net-worth/${e.target.value}`);
  };

  handleMonthClick = ({ name, month }) => {
    const assets = orderBy(
      this.props.months
        .find(m => m.month === month)
        .items.filter(i => i.isAsset)
        .map(i => ({
          id: i.id,
          name: this.props.assets.find(a => a.id === i.assetId).name,
          amount: i.amount,
        })),
      'name',
    );

    const liabilities = orderBy(
      this.props.months
        .find(m => m.month === month)
        .items.filter(i => !i.isAsset)
        .map(i => ({
          id: i.id,
          name: this.props.liabilities.find(a => a.id === i.assetId).name,
          amount: i.amount,
        })),
      'name',
    );

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
      const _year = months[i].year;
      const _month = months[i].month;

      const future = moment().isBefore(
        `${_year}-${_month > 9 ? _month : '0' + _month}-01`,
      );

      return {
        ...a,
        y: future ? null : y,
      };
    });

    return (
      <div>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size={800}>NET WORTH FOR {year}</Heading>
          <Select
            value={year}
            onChange={this.changeYear}
            flex="unset"
            width={100}
          >
            {availableYears().map(y => {
              return (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              );
            })}
          </Select>
        </Pane>
        {(loading || refreshing) && (
          <Pane textAlign="center" marginY={56}>
            <Spinner marginX="auto" />
            <Text marginY={16}>Loading...</Text>
          </Pane>
        )}
        <Pane display={loading || refreshing ? 'none' : ''} paddingTop={32}>
          <Graphchart
            assets={assetData}
            liabilities={liabilityData}
            netWorth={netWorthData}
            onMonthClick={this.handleMonthClick}
          />
          <MonthModal
            ref={monthModal => (this.monthModal = monthModal)}
            month={this.state.selectedMonth}
            importNetWorthItems={this.props.importNetWorthItems}
          />
        </Pane>
        <Alert
          appearance="card"
          intent="warning"
          title="Limited functionality on the web"
          marginTop={8}
          marginBottom={8}
        >
          <Paragraph>
            Currently Net Worth can only be modified from the&nbsp;
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://itunes.apple.com/us/app/budgetal-app/id1326525398?mt=8"
            >
              iOS
            </Link>
            {' and '}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=com.budgetal.app"
            >
              Android
            </Link>
            &nbsp;apps
          </Paragraph>
        </Alert>
      </div>
    );
  }
}

export default NetWorth;
