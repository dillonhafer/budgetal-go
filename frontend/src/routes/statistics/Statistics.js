import React, { Component } from 'react';
import { FindStatisticRequest } from '@shared/api/statistics';
import { title, scrollTop, error } from 'window';
import { availableYears, currencyf, monthName } from '@shared/helpers';
import { Text, Heading, Select, Pane } from 'evergreen-ui';
import times from 'lodash/times';
import './statistics.css';
import StatisticsChart from './StatisticsChart';
import Spinner from 'components/Spinner';
import { colors } from '@shared/theme';

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
          paddingX={24}
          display="flex"
          background={colors.primary}
          flexDirection="row"
          alignItems="center"
          paddingTop={48}
          paddingBottom={72}
          marginBottom={-48}
          justifyContent="space-between"
        >
          <Heading color="white" size={800}>
            Statistics for {monthName(month)} {year}
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
        <Pane display={'flex'} paddingX={24} marginTop={16} flexDirection="row">
          {loading || this.state.budgetCategories.length > 0
            ? null
            : this.missing()}
          <Pane
            display="flex"
            flexDirection="column"
            flex="1"
            elevation={2}
            borderRadius={8}
            background="white"
            marginRight={32}
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
                <Heading size={400}>Pie Chart Graph</Heading>
              </Pane>
            </Pane>
            <StatisticsChart budgetCategories={this.state.budgetCategories} />
          </Pane>
          <Pane
            display="flex"
            flexDirection="column"
            flex="1"
            elevation={2}
            borderRadius={8}
            background="white"
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              borderBottom={'0.5px solid rgba(67, 90, 111, 0.25)'}
              height={64}
              padding={16}
            >
              <Pane flex={1} alignItems="center" display="flex">
                <Heading size={400}>Percent Spent By Category</Heading>
              </Pane>
            </Pane>

            <Pane paddingX={32}>
              <ul
                style={{ marginLeft: 0, paddingLeft: 0, width: '100%' }}
                className="stat-list"
              >
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
      </Pane>
    );
  }
}

export default Statistics;
