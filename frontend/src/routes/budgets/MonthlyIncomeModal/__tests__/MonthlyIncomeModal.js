import React from 'react';
import { shallow } from 'enzyme';
import MonthlyIncomeModal from '../MonthlyIncomeModal';

const defaultProps = {
  budget: {
    income: 3000.0,
    year: 2018,
    month: 8,
  },
  updateIncome: jest.fn(),
};

describe('MonthlyIncomeModal', () => {
  it('renders a MonthlyIncomeModal', () => {
    const comp = shallow(<MonthlyIncomeModal {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
