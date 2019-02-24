import React, { Component } from 'react';
import { currencyf } from '@shared/helpers';
import { Heading, Badge, Strong, Text, Pane, Popover } from 'evergreen-ui';

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
        <Pane>
          <Text>{currencyf(month.balance)}</Text>
        </Pane>
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
      div = (
        <div>
          <Text>Paid Month</Text>
        </div>
      );
    }

    if (month.early) {
      color = 'blue';
      isSolid = true;
      div = (
        <div>
          <Text>Paid Early!</Text>
        </div>
      );
    }

    return (
      <Popover
        position="top"
        minWidth={40}
        target={this.badge}
        content={
          <Pane padding={16} textAlign="center">
            <Text>
              <Strong>{date.format('MMMM YYYY')}</Strong>
            </Text>
            {div}
          </Pane>
        }
      >
        <Badge
          ref={b => (this.badge = b)}
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
