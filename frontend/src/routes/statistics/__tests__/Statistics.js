import React from 'react';
import { shallow, mount } from 'enzyme';
import Statistics from '../Statistics';

const defaultProps = {
  match: {
    params: {
      year: 2018,
      month: 8,
    },
  },
};

describe('Statistics', () => {
  it('renders', () => {
    const comp = shallow(<Statistics {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });

  it('has the correct header', () => {
    const comp = mount(<Statistics {...defaultProps} />);
    expect(comp.find('Heading').text()).toEqual('STATISTICS FOR AUGUST 2018');
  });
});
