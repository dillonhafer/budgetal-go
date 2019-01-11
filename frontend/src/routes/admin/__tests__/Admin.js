import React from 'react';
import { shallow } from 'enzyme';
import Admin from '../Admin';

const user = {
  id: 1,
  firstName: 'Liz',
  lastName: 'Lemon',
  email: 'lizzy+lemon@example.com',
  lastSignIn: '2017-11-13T18:20:44.114363-05:00',
};

describe('Admin', () => {
  it('renders', () => {
    const comp = shallow(<Admin />);
    comp.setState({ isAdmin: true, users: [user] });
    expect(comp).toMatchSnapshot();
  });
});
