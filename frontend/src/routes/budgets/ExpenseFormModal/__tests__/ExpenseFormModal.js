import React from 'react';
import { shallow } from 'enzyme';
import ExpenseFormModal from '../ExpenseForm';

const defaultProps = {
  expense: {
    id: null,
    budgetItemId: 1,
    amount: 3000.0,
    name: '',
    date: '2019-01-01',
  },
  createdExpense: jest.fn(),
  updateExpense: jest.fn(),
  unselectExpense: jest.fn(),
};

describe('ExpenseFormModal', () => {
  it('renders a ExpenseFormModal', () => {
    const comp = shallow(<ExpenseFormModal {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
