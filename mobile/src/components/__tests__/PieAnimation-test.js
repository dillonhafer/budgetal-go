import React from 'react';
import renderer from 'react-test-renderer';

// TestFiles
import PieAnimation from 'components/PieAnimation';
jest.mock('expo', () => ({ DangerZone: { Lottie: 'Lottie' } }));

test('renders correctly', () => {
  const tree = renderer.create(<PieAnimation />).toJSON();
  expect(tree).toMatchSnapshot();
});
