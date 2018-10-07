import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import { colors } from 'window';

ReactHighcharts.Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

export default class Highchart extends Component {
  static defaultProps = {
    assets: [],
    liabilities: [],
  };

  setTheme(colors) {
    ReactHighcharts.Highcharts.theme = {
      legend: { itemStyle: { fontWeight: 'bold', fontSize: '13px' } },
      yAxis: {
        minorTickInterval: 'auto',
        title: { style: { textTransform: 'uppercase' } },
        labels: { style: { fontSize: '12px' } },
      },
    };

    ReactHighcharts.Highcharts.setOptions(ReactHighcharts.Highcharts.theme);
  }

  shouldComponentUpdate(newProps) {
    const chart = this.refs.chart.getChart();

    chart.series[0].setData(newProps.netWorth);
    chart.series[1].setData(newProps.assets);
    chart.series[2].setData(newProps.liabilities);
    return false;
  }

  handleMonthClick = ({ point }) => {
    const month = point.index + 1;
    const name = point.series.name;
    this.props.onMonthClick({ name, month });
  };

  config(assets, liabilities, netWorth) {
    const defaultConfig = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      tooltip: {
        // eslint-disable-next-line no-template-curly-in-string
        pointFormat: '{series.name}: <b>${point.y:,.2f}</b>',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          label: {
            connectorAllowed: false,
          },
          pointStart: 0,
          point: {
            events: {
              click: this.handleMonthClick,
            },
          },
        },
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      series: [
        {
          name: 'Net Worth',
          data: netWorth,
          color: colors.primary,
        },
        {
          name: 'Assets',
          data: assets,
          visible: false,
          color: colors.success,
        },
        {
          name: 'Liabilities',
          data: liabilities,
          visible: false,
          color: colors.error,
        },
      ],
    };

    return defaultConfig;
  }

  render() {
    const config = this.config(
      this.props.assets,
      this.props.liabilities,
      this.props.netWorth,
    );
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    return <ReactHighcharts ref="chart" config={config} />;
  }
}
