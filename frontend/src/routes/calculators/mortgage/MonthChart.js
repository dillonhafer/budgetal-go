import React, { PureComponent } from 'react';
import moment from 'moment';
import Month from './Month';
import { currencyf } from '@shared/helpers';
import { Pane, Table, SegmentedControl } from 'evergreen-ui';

class Grid extends PureComponent {
  render() {
    const { months, startMonth, startYear } = this.props;
    const squares = months.map((month, i) => {
      const date = moment([startYear, startMonth, 1]).add(i, 'M');
      const key = `grid-${date.year()}-${date.month()}`;
      return <Month key={key} month={month} date={date} />;
    });

    return (
      <div
        style={{
          borderRadius: '4px',
          padding: '18px 8px 18px 18px',
          border: '1px solid #e9e9e9',
        }}
      >
        {squares}
      </div>
    );
  }
}

class List extends PureComponent {
  render() {
    const { months } = this.props;
    const validMonth = (month) => {
      return !month.pastMonth && !month.early;
    };
    const today = new Date();

    return (
      <Table>
        <Table.Head accountForScrollbar>
          <Table.TextHeaderCell>Date</Table.TextHeaderCell>
          <Table.TextHeaderCell>Payment</Table.TextHeaderCell>
          <Table.TextHeaderCell>Extra Principle</Table.TextHeaderCell>
          <Table.TextHeaderCell>Principle</Table.TextHeaderCell>
          <Table.TextHeaderCell>Interest</Table.TextHeaderCell>
          <Table.TextHeaderCell>Balance</Table.TextHeaderCell>
          <Table.TextHeaderCell>Interest Paid</Table.TextHeaderCell>
        </Table.Head>
        <Table.VirtualBody height={500}>
          {months.filter(validMonth).map((month, i) => {
            const date = moment([
              today.getFullYear(),
              today.getMonth() + 1,
              1,
            ]).add(i, 'M');

            return (
              <Table.Row
                key={`ds-${date.format('MMMM-YYY')}`}
                background={date.month() === 0 ? '#edf7ff' : 'none'}
              >
                <Table.TextCell>{date.format('MMMM YYYY')}</Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.principal + month.interest)}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.extra)}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.principal - month.extra)}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.interest)}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.balance)}
                </Table.TextCell>
                <Table.TextCell isNumber>
                  {currencyf(month.totalInterest)}
                </Table.TextCell>
              </Table.Row>
            );
          })}
        </Table.VirtualBody>
      </Table>
    );
  }
}

class MonthChart extends PureComponent {
  state = {
    chartType: 'grid',
  };

  get options() {
    return [
      {
        label: 'Grid',
        value: 'grid',
      },
      {
        label: 'List',
        value: 'list',
      },
    ];
  }

  render() {
    const { months, startYear, startMonth } = this.props;
    const { chartType } = this.state;

    return (
      <Pane>
        <Pane display="flex" alignItems="center" justifyContent="center">
          <SegmentedControl
            width={240}
            options={this.options}
            value={chartType}
            onChange={(chartType) => this.setState({ chartType })}
          />
        </Pane>
        <Pane marginTop={16}>
          <div className="monthChart">
            {chartType === 'grid' ? (
              <Pane display={chartType === 'grid' ? 'block' : 'none'}>
                <Grid
                  months={months}
                  startYear={startYear}
                  startMonth={startMonth}
                />
              </Pane>
            ) : (
              <Pane display={chartType === 'list' ? 'block' : 'none'}>
                <List months={months} />
              </Pane>
            )}
          </div>
        </Pane>
      </Pane>
    );
  }
}

export default MonthChart;
