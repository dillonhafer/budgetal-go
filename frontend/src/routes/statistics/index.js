import React, {Component} from 'react';
import {FindStatisticRequest} from 'api/statistics';
import {title, scrollTop, error} from 'window';
import {availableYears} from 'helpers';
import {currencyf} from 'helpers';
import moment from 'moment';

import Highchart from 'highchart';

import Popover from 'antd/lib/popover';
import DatePicker from 'antd/lib/date-picker';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import 'css/statistics.css';

const monthName = month => {
  return moment.months()[month - 1];
};

class Statistics extends Component {
  state = {
    showForm: false,
    budgetCategories: [],
  };

  componentDidMount() {
    const {month, year} = this.props.match.params;
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
      series: [{data}],
    };
  }

  chartData(categories) {
    return categories.map(category => {
      return {y: category.percentSpent, name: category.name};
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
    } else {
      return this.missing();
    }
  }

  missing() {
    return (
      <div className="text-center">
        <h2>Uh-oh!</h2>
        <p>It looks like you don't have a budget for this month</p>
      </div>
    );
  }

  handleOnChange = (date, dateString) => {
    this.props.history.push(
      `/monthly-statistics/${date.year()}/${date.month() + 1}`,
    );
  };

  findDisabledDate(date) {
    const year = date.year();
    const years = availableYears();
    return year < years[0] || year > years[years.length - 1] ? true : false;
  }

  handleVisibleChange = showForm => {
    this.setState({showForm});
  };

  loadStatistics = async () => {
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
              parseFloat(cat.amountSpent) / totalSpent * 100,
            );
          }
          return {
            name,
            amountSpent,
            percentSpent,
          };
        });
        this.setState({budgetCategories});
      }
    } catch (err) {
      error(err);
    }
  };

  render() {
    const {month, year} = this.props.match.params;
    return (
      <div>
        <h1>
          Statistics for {monthName(month)} {year}
          <Popover
            content={
              <DatePicker.MonthPicker
                onChange={this.handleOnChange}
                disabledDate={this.findDisabledDate}
              />
            }
            title="Change Date"
            placement="rightTop"
            trigger="click"
            visible={this.state.showForm}
            onVisibleChange={this.handleVisibleChange}
          >
            <a onClick={this.showForm} style={{marginLeft: '15px'}}>
              <Icon type="calendar" />
            </a>
          </Popover>
        </h1>
        <Row>
          <Col md={12}>{this.renderStatistics()}</Col>
          <Col md={12}>
            <ul className="stat-list">
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default Statistics;
