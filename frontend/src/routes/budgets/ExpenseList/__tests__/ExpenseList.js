import React from 'react';
import { shallow } from 'enzyme';
import ExpenseList from '../ExpenseList';

const defaultProps = {
  budget: {
    year: 1996,
    month: 1,
  },
  budgetItem: {
    id: 1,
    name: 'Item Name',
  },
  budgetItemExpenses: [
    {
      id: 1,
      budgetItemId: 1,
      amount: 3000.0,
      name: '',
      date: '2019-01-01',
    },
  ],
  selectExpense: jest.fn(),
};

describe('ExpenseList', () => {
  it('renders a ExpenseList', () => {
    const comp = shallow(<ExpenseList {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
