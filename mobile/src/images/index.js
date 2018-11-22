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
