import {range} from 'lodash';

export const currencyf = (number, dollarSign = '$') => {
  if (isNaN(parseFloat(number))) {
    number = 0;
  }
  const group3Regex = /(\d)(?=(\d{3})+\.)/g;
  const newNumber = parseFloat(number).toFixed(2);
  return dollarSign + newNumber.replace(group3Regex, '$1,');
};

export const availableYears = () => {
  return range(2015, new Date().getFullYear() + 3);
};
