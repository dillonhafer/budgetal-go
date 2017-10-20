import React, {Component} from 'react';
import {currencyf} from 'helpers';
import Popover from 'antd/lib/popover';
import Tag from 'antd/lib/tag';

class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  render() {
    const {date, month} = this.props;

    let classNames = ['month'];

    let div = (
      <div style={{textAlign: 'center'}}>
        <Tag color="blue">
          {currencyf(month.extra)} / {currencyf(month.principal - month.extra)}
        </Tag>
        <br />
        <Tag color="red">{currencyf(month.interest)}</Tag>
        <h3>{currencyf(month.balance)}</h3>
      </div>
    );

    if (this.state.focused) {
      classNames.push('focus');
    } else {
      classNames = [...classNames.filter(n => n !== 'focus')];
    }

    let color = '#ccc';
    if (!month.early && date.format('M') === '1') {
      color = 'gray';
      classNames.push('year');
    }

    if (month.pastMonth) {
      classNames.push('past');
      color = '#68d453';
      if (date.format('M') === '1') {
        color = '#268a31';
      }
      div = <div>Paid Month</div>;
    }

    if (month.early) {
      color = '#1a98fc';
      div = <div>Paid Early!</div>;
    }

    return (
      <Popover
        content={
          <span className="paymentPopover">
            <div style={{textAlign: 'center'}}>
              <b>{date.format('MMMM YYYY')}</b>
            </div>
            {div}
          </span>
        }
      >
        <Tag color={color} />
      </Popover>
    );
  }
}

export default Month;
