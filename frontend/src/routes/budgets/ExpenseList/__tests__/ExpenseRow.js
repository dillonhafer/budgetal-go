import React from 'react';
import { shallow } from 'enzyme';
import ExpenseRow from '../ExpenseRow';

const defaultProps = {
  expense: {
    id: 1,
    budgetItemId: 1,
    amount: 3000.0,
    name: '',
    date: '2019-01-01',
  },
  removeExpense: jest.fn(),
  selectExpense: jest.fn(),
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
};

describe('ExpenseRow', () => {
  it('renders a ExpenseRow', () => {
    const comp = shallow(<ExpenseRow {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
