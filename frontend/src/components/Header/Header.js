import React from 'react';
import { Pane, Heading } from 'evergreen-ui';
import { colors } from '@shared/theme';

const Header = React.memo(({ heading, subtext, children, ...paneProps }) => (
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
    <Pane>
      <Heading color="white" size={800}>
        {heading}
      </Heading>
      {subtext && (
        <Heading color="white" marginTop={8} size={500}>
          {subtext}
        </Heading>
      )}
    </Pane>
    {children}
  </Pane>
));

export default Header;
