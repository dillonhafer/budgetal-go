import React from 'react';
import { Pane, Heading } from 'evergreen-ui';
import { colors } from '@shared/theme';

const Header = React.memo(({ heading, children, ...paneProps }) => (
  <Pane
    paddingX={24}
    display="flex"
    background={colors.primary}
    flexDirection="row"
    alignItems="center"
    paddingTop={48}
    paddingBottom={72}
    marginBottom={-48}
    justifyContent="space-between"
  >
    <Heading color="white" size={800}>
      {heading}
    </Heading>
    {children}
  </Pane>
));

export default Header;
