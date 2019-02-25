import React, { Component } from 'react';
import { orderBy } from 'lodash';
import { title, scrollTop } from 'window';
import { availableYears, monthName } from '@shared/helpers';
import Graphchart from 'graphchart';
import moment from 'moment';
import MonthModal from './MonthModal';
import { Heading, Pane, Select } from 'evergreen-ui';
import AssetLiabilityTable from './AssetLiabilityTable';
import Spinner from 'components/Spinner';
import Header from 'components/Header';

class NetWorth extends Component {
  componentDidMount() {
    const year = this.props.match.params.year;
    title(`${year} | Net Worth`);
    this.loadNetWorthItems({ year });
    scrollTop();
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

  reloadMonthModal = () => {
    this.handleMonthClick({
      name: this.state.selectedMonth.name,
      month: this.state.selectedMonth.number,
    });
  };

  handleMonthClick = ({ name, month }) => {
    const assets = orderBy(
      this.props.months
        .find(m => m.month === month)
        .items.filter(i => i.isAsset)
        .map(i => ({
          id: i.id,
          name: this.props.assets.find(a => a.id === i.assetId).name,
          assetId: i.assetId,
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
          assetId: i.assetId,
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
      <Pane>
        <Header
          subtext="Keep track of how far you've come"
          heading={`Net Worth for ${year}`}
        >
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
        </Header>
        <Spinner visible={loading || refreshing} />
        <Pane paddingX={24} marginTop={16}>
          <Pane
            flexDirection="column"
            flex="1"
            elevation={2}
            overflow="hidden"
            borderRadius={8}
            background="white"
            display={loading || refreshing ? 'none' : 'flex'}
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height={64}
              borderBottom={'0.5px solid rgba(67, 90, 111, 0.25)'}
              padding={16}
            >
              <Pane flex={1} alignItems="center" display="flex">
                <Heading size={400}>Yearly Net Worth Graph</Heading>
              </Pane>
            </Pane>
            <Pane padding={24}>
              <Graphchart
                assets={assetData}
                liabilities={liabilityData}
                netWorth={netWorthData}
                onMonthClick={this.handleMonthClick}
              />
            </Pane>
            <MonthModal
              ref={monthModal => (this.monthModal = monthModal)}
              month={this.state.selectedMonth}
              reload={this.reloadMonthModal}
              importNetWorthItems={this.props.importNetWorthItems}
            />
          </Pane>
          <Pane
            display={loading || refreshing ? 'none' : 'flex'}
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="space-between"
            background="white"
            marginTop={32}
          >
            <AssetLiabilityTable
              title="Assets"
              items={this.props.assets}
              emptyText={'No Assets'}
              buttonTitle="Add Asset"
              deleteAssetLiability={this.props.deleteAssetLiability}
            />
            <Pane width={16} />
            <AssetLiabilityTable
              title="Liabilities"
              items={this.props.liabilities}
              emptyText={'No Liabilities'}
              buttonTitle="Add Liability"
              deleteAssetLiability={this.props.deleteAssetLiability}
            />
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default NetWorth;
