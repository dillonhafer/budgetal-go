import React, { Component } from 'react';
import { FindStatisticRequest } from '@shared/api/statistics';
import { title, scrollTop, error } from 'window';
import { availableYears, currencyf, monthName } from '@shared/helpers';
import { Text, Heading, Select, Pane } from 'evergreen-ui';
import times from 'lodash/times';
import './statistics.css';
import StatisticsChart from './StatisticsChart';
import Spinner from 'components/Spinner';

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

  missing() {
    return (
      <Pane textAlign="center" width="100%" margin="80px">
        <h2>Uh-oh!</h2>
        <p>It looks like you don't have a budget for this month</p>
      </Pane>
    );
  }

  handleOnDateChange = e => {
    const date = {
      year: this.props.match.params.year,
      month: this.props.match.params.month,
      [e.target.name]: e.target.value,
    };

    this.props.history.push(`/monthly-statistics/${date.year}/${date.month}`);
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
    const { loading } = this.state;
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

        <Spinner visible={loading} />
        <Pane display={'flex'} flexDirection="row">
          {loading || this.state.budgetCategories.length > 0
            ? null
            : this.missing()}
          <Pane display="flex" flex="1">
            <StatisticsChart budgetCategories={this.state.budgetCategories} />
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
                      <Text>
                        <div className={statIconClass} />
                        <b>{category.name}</b>
                        <br />
                        <span className="percentSpent">
                          {currencyf(category.amountSpent)} -{' '}
                          {category.percentSpent}%
                        </span>
                      </Text>
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
