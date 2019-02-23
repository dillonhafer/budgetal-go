import React from 'react';
import { Text, Pane } from 'evergreen-ui';
import Progress from './Progress';
import { currencyf } from '@shared/helpers';

const SpentProgress = React.memo(({ status, percent, spent, remaining }) => (
  <Pane display="flex" flexDirection="column">
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text>Spent: {currencyf(spent)}</Text>
      <Text>Remaining: {currencyf(remaining)}</Text>
    </Pane>
    <Progress status={status} percent={percent} />
  </Pane>
));

export default SpentProgress;
