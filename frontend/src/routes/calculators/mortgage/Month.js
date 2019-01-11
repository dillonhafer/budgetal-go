import React, { Component } from 'react';
import { currencyf } from '@shared/helpers';
import { Popover } from 'antd';
import { Badge } from 'evergreen-ui';

class Month extends Component {
  state = {
    focused: false,
  };

  render() {
    const { date, month } = this.props;

    let classNames = ['month'];

    let div = (
      <div style={{ textAlign: 'center' }}>
        <Badge color="blue">
          {currencyf(month.extra)} / {currencyf(month.principal - month.extra)}
        </Badge>
        <br />
        <Badge color="red">{currencyf(month.interest)}</Badge>
        <h3>{currencyf(month.balance)}</h3>
      </div>
    );

    if (this.state.focused) {
      classNames.push('focus');
    } else {
      classNames = [...classNames.filter(n => n !== 'focus')];
    }

    let isSolid = false;
    let color = 'neutral';
    if (!month.early && date.format('M') === '1') {
      color = 'neutral';
      isSolid = true;
      classNames.push('year');
    }

    if (month.pastMonth) {
      classNames.push('past');
      color = 'green';
      if (date.format('M') === '1') {
        isSolid = true;
        color = 'green';
      }
      div = <div>Paid Month</div>;
    }

    if (month.early) {
      color = 'blue';
      isSolid = true;
      div = <div>Paid Early!</div>;
    }

    return (
      <Popover
        content={
          <span className="paymentPopover">
            <div style={{ textAlign: 'center' }}>
              <b>{date.format('MMMM YYYY')}</b>
            </div>
            {div}
          </span>
        }
      >
        <Badge
          height={18}
          width={18}
          margin={2}
          isInteractive
          color={color}
          isSolid={isSolid}
        />
      </Popover>
    );
  }
}

export default Month;
