import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highchart from 'highchart';

class StatisticsChart extends Component {
  static propTypes = {
    budgetCategories: PropTypes.arrayOf(
      PropTypes.shape({
        percentSpent: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  };

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

  render() {
    if (this.props.budgetCategories.length > 0) {
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

      const data = this.chartData(this.props.budgetCategories);
      const config = this.chartConfig(data);
      return <Highchart config={config} colors={colors} />;
    }

    return null;
  }
}

export default StatisticsChart;
