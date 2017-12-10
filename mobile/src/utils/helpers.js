import { reduce, round } from 'lodash';

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

export const currencyf = (number, dollarSign = '$') => {
  if (isNaN(parseFloat(number))) {
    number = 0;
  }
  const group3Regex = /(\d)(?=(\d{3})+\.)/g;
  const newNumber = parseFloat(number).toFixed(2);
  return dollarSign + newNumber.replace(group3Regex, '$1,');
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
