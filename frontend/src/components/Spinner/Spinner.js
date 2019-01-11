import React from 'react';
import PropTypes from 'prop-types';
import { Pane, Text, Spinner as GreenSpinner } from 'evergreen-ui';

const Spinner = ({ visible = false, title = 'Loading...' }) =>
  visible ? (
    <Pane textAlign="center" marginY={56}>
      <GreenSpinner marginX="auto" />
      <Text marginY={16}>{title}</Text>
    </Pane>
  ) : null;

Spinner.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
};

export default Spinner;
