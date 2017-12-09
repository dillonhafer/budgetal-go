import { range, reduce, round } from 'lodash';
import parser from 'ua-parser-js';
import moment from 'moment';

export const monthName = month => {
  return moment.months()[month - 1];
};

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

export const pluralize = (count, singlular, plural) => {
  let word = plural;
  if (count === 1) word = singlular;

  return `${count} ${word}`;
};

export const humanUA = userAgent => {
  const ua = parser(userAgent);
  let text = `${ua.browser.name} ${ua.browser.major} on ${ua.os.name}`;

  if (ua.browser.name === undefined) {
    text = ua.ua;
  }

  if (ua.ua.includes('Budgetal') || ua.ua.includes('Expo')) {
    text = 'Budgetal App on iOS';
  }

  return text;
};

export const reduceSum = (array, property = 'amount') => {
  return reduce(
    array,
    (total, item) => {
      const sum = parseFloat(total) + parseFloat(item[property]);
      return round(sum, 2);
    },
    0.0,
  );
};
