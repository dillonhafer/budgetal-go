import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { monthName } from '@shared/helpers';
import { Pane, SelectField } from 'evergreen-ui';
import times from 'lodash/times';

const defaultMaxYear = new Date().getFullYear() + 3;

const stringToDate = (dateString, key) => {
  if (!dateString) return key;

  const [year, month, day] = dateString.split('-');
  const parts = {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  };
  return String(parts[key]) || key;
};

class DateSelect extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    maxYear: PropTypes.number,
  };

  state = {};

  dateToPropogate = dateState => {
    const { month, day, year } = dateState;
    const date = moment({ year, month: month - 1, day });
    return date;
  };

  handleOnChange = e => {
    const defaultValue = this.props.defaultValue;

    const { name, value } = e.target;
    const {
      month = stringToDate(defaultValue, 'month'),
      day = stringToDate(defaultValue, 'day'),
      year = stringToDate(defaultValue, 'year'),
    } = this.state;

    const newState = { month, day, year, [name]: value };
    this.setState(newState);

    const date = this.dateToPropogate(newState);
    const newValue =
      date.isValid() && date.year() > 1900 ? date.format('YYYY-MM-DD') : '';
    this.props.onChange({
      ...e,
      target: { ...e.target, name: this.props.name, value: newValue },
    });
  };

  render() {
    const {
      defaultValue: value,
      maxYear = defaultMaxYear,
      label = 'Choose Date',
      isInvalid,
      validationMessage,
      required = false,
    } = this.props;
    const {
      month = stringToDate(value, 'month'),
      day = stringToDate(value, 'day'),
      year = stringToDate(value, 'year'),
    } = this.state;

    return (
      <Pane display="flex" flexDirection="row" justifyContent="space-between">
        <SelectField
          flex="1"
          marginRight="10px"
          label={label}
          name="month"
          onChange={this.handleOnChange}
          value={month}
          isInvalid={isInvalid}
          validationMessage={validationMessage}
          required={required}
        >
          <option>Month</option>
          {times(12, i => (
            <option key={i} value={i + 1}>
              {monthName(i + 1)}
            </option>
          ))}
        </SelectField>
        <SelectField
          onChange={this.handleOnChange}
          name="day"
          label="&nbsp;"
          marginRight="10px"
          isInvalid={isInvalid}
          value={day}
        >
          <option>Day</option>
          {times(31, i => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </SelectField>
        <SelectField
          onChange={this.handleOnChange}
          name="year"
          label="&nbsp;"
          isInvalid={isInvalid}
          value={year}
        >
          <option>Year</option>
          {times(100, i => (
            <option key={i} value={maxYear - i}>
              {maxYear - i}
            </option>
          ))}
        </SelectField>
      </Pane>
    );
  }
}

export default DateSelect;
