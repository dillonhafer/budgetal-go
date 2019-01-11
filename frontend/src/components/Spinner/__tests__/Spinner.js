import React from 'react';
import { shallow } from 'enzyme';
import Spinner from '../Spinner';

describe('Spinner', () => {
  describe('when visible is true', () => {
    it('renders a spinner', () => {
      const comp = shallow(<Spinner visible={true} />);
      expect(
        comp
          .find('withTheme(Text)')
          .children()
          .text(),
      ).toEqual('Loading...');
      expect(comp).toMatchSnapshot();
    });
  });

  describe('when visible is false', () => {
    it('renders null', () => {
      const comp = shallow(<Spinner visible={false} />);
      expect(comp.type()).toEqual(null);
    });
  });

  it('renders custom text', () => {
    const comp = shallow(<Spinner visible={true} title="Hold On..." />);
    expect(
      comp
        .find('withTheme(Text)')
        .children()
        .text(),
    ).toEqual('Hold On...');
  });
});
