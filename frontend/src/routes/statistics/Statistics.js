import React, { Component } from 'react';
import { FindStatisticRequest } from '@shared/api/statistics';
import { title, scrollTop, error } from 'window';
import { availableYears, currencyf } from '@shared/helpers';
import moment from 'moment';
import Highchart from 'highchart';
import { Heading, Select, Pane } from 'evergreen-ui';
import times from 'lodash/times';
import 'css/statistics.css';

const monthName = month => {
  return moment.months()[month - 1];
};

class Statistics extends Component {
  state = {
    loading: false,
    budgetCategories: [],
  };

  componentDidMount() {
    const { month, year } = this.props.match.params;
    title(`${monthName(month)} ${year} | Statistics`);
    scrollTop();
    this.loadStatistics();
  }

  chartConfig(data) {
    return {
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          showInLegend: false,
          innerSize: '40%',
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [{ data }],
    };
  }

  chartData(categories) {
    return categories.map(category => {
      return { y: category.percentSpent, name: category.name };
    });
  }

  renderStatistics() {
    if (this.state.budgetCategories.length > 0) {
      const colors = [
        '#fc121e',
        '#fd8dd7',
        '#fd9226',
        '#1a98fc',
        '#fc2a1c',
        '#935211',
        '#0a5591',
        '#fed37f',
        '#1a98fc',
        '#929292',
        '#fd9226',
        '#5e5e5e',
      ];

      const data = this.chartData(this.state.budgetCategories);
      const config = this.chartConfig(data);
      return <Highchart config={config} colors={colors} />;
    }
  }

  missing() {
    return (
      <Pane textAlign="center" width="100%" margin="80px">
        <h2>Uh-oh!</h2>
        <p>It looks like you don't have a budget for this month</p>
      </Pane>
    );
  }

  handleOnChange = (date, dateString) => {
    this.props.history.push(
      `/monthly-statistics/${date.year()}/${date.month() + 1}`,
    );
  };

  handleOnDateChange = e => {
    const date = {
      year: this.props.match.params.year,
      month: this.props.match.params.month,
      [e.target.name]: e.target.value,
    };

    this.props.history.push(`/monthly-statistics/${date.year}/${date.month}`);
  };

  findDisabledDate = date => {
    if (
      this.props.match.params.year === String(date.year()) &&
      this.props.match.params.month === String(date.month() + 1)
    ) {
      return true;
    }
    const year = date.year();
    const years = availableYears();
    return year < years[0] || year > years[years.length - 1] ? true : false;
  };

  loadStatistics = async () => {
    this.setState({ loading: true });
    try {
      const resp = await FindStatisticRequest(this.props.match.params);
      if (resp && resp.ok) {
        const totalSpent = resp.budgetCategories.reduce(
          (acc, cat) => acc + parseFloat(cat.amountSpent),
          0.0,
        );
        const budgetCategories = resp.budgetCategories.map(cat => {
          const name = cat.name;
          const amountSpent = parseFloat(cat.amountSpent);

          let percentSpent = 0;
          if (parseFloat(cat.amountSpent) > 0) {
            percentSpent = Math.round(
              (parseFloat(cat.amountSpent) / totalSpent) * 100,
            );
          }
          return {
            name,
            amountSpent,
            percentSpent,
          };
        });
        this.setState({ budgetCategories });
      }
    } catch (err) {
      error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { month, year } = this.props.match.params;
    return (
      <Pane>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={16}
        >
          <Heading size={800}>
            STATISTICS FOR {monthName(month).toUpperCase()} {year}
          </Heading>
          <Pane>
            <Select
              defaultValue={month}
              name="month"
              onChange={this.handleOnDateChange}
              flex="unset"
              width={90}
              marginRight={4}
            >
              {times(12, i => (
                <option key={i} value={i + 1}>
                  {monthName(i + 1)}
                </option>
              ))}
            </Select>
            <Select
              defaultValue={year}
              name="year"
              onChange={this.handleOnDateChange}
              flex="unset"
              width={70}
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
        </Pane>

        <Pane display="flex" flexDirection="row">
          {this.state.budgetCategories.length ? null : this.missing()}
          <Pane display="flex" flex="1">
            {this.renderStatistics()}
          </Pane>
          <Pane display="flex" flex="1">
            <ul className="stat-list" style={{ width: '100%' }}>
              {this.state.budgetCategories.map((category, key) => {
                const statIconClass =
                  'stat-icon stat-icon-' +
                  category.name.toLowerCase().replace('/', '-');
                return (
                  <li key={key}>
                    <div className="stat-list-item">
                      <div className={statIconClass} />
                      <b>{category.name}</b>
                      <br />
                      <span className="percentSpent">
                        {currencyf(category.amountSpent)} -{' '}
                        {category.percentSpent}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default Statistics;
