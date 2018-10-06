import { reduce, round } from 'lodash';
import parser from 'ua-parser-js';
import moment from 'moment';

export const monthName = month => {
  return moment.months()[month - 1];
};

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;
export const validEmail = email => {
  return EMAIL_REGEX.test(email);
};

export const percentSpent = (budgeted, spent) => {
  const p = (spent / budgeted) * 100;
  if (p > 99.99) {
    return 100;
  }

  if (isNaN(p)) {
    return 0;
  }

  return parseInt(p, 10);
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

export const currencyf = (number, dollarSign = '$', fixed = 2) => {
  if (isNaN(parseFloat(number))) {
    number = 0;
  }
  const group3Regex = /(\d)(?=(\d{3})+\.)/g;
  const newNumber = parseFloat(number).toFixed(2);
  const str = dollarSign + newNumber.replace(group3Regex, '$1,');
  return fixed > 0 ? str : str.slice(0, -3);
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

  if (ua.ua.includes('okhttp')) {
    text = 'Budgetal App on Android';
  }

  return text;
};

export const categoryImage = name => {
  switch (name) {
    case 'Charity':
      return require('images/Charity.png');
    case 'Saving':
      return require('images/Saving.png');
    case 'Housing':
      return require('images/Housing.png');
    case 'Utilities':
      return require('images/Utilities.png');
    case 'Food':
      return require('images/Food.png');
    case 'Clothing':
      return require('images/Clothing.png');
    case 'Transportation':
      return require('images/Transportation.png');
    case 'Medical/Health':
      return require('images/Health.png');
    case 'Insurance':
      return require('images/Insurance.png');
    case 'Personal':
      return require('images/Personal.png');
    case 'Recreation':
      return require('images/Recreation.png');
    case 'Debts':
      return require('images/Debts.png');
  }
};
