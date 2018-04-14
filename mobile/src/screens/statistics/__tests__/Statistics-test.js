import React from 'react';
import renderer from 'react-test-renderer';

// TestFiles
import StatisticsScreen from 'screens/statistics/Statistics';

test('renders correctly', () => {
  const tree = renderer.create(<StatisticsScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
