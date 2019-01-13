import React from 'react';
import { shallow } from 'enzyme';
import Mortgage from '../Mortgage';

const defaultProps = {
  startYear: 2016,
  loanBalance: 150000,
  startMonth: 6,
  interestRate: 3.5,
  yearTerm: 15,
  currentBalance: 80000,
  extraMonthlyPayment: 1000,
  updateState: jest.fn(),
};

describe('Mortgage', () => {
  it('renders', () => {
    const comp = shallow(<Mortgage {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
