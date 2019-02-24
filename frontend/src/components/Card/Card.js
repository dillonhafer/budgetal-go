import React from 'react';
import { Pane, Heading } from 'evergreen-ui';

const Card = React.memo(({ title, children, ...paneProps }) => (
  <Pane
    display="flex"
    flexDirection="column"
    flex="1"
    elevation={2}
    borderRadius={8}
    background="white"
    {...paneProps}
  >
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height={64}
      borderBottom={'0.5px solid rgba(67, 90, 111, 0.25)'}
      padding={16}
    >
      <Pane flex={1} alignItems="center" display="flex">
        {typeof title === 'string' ? (
          <Heading size={400}>{title}</Heading>
        ) : (
          title
        )}
      </Pane>
    </Pane>
    <Pane padding={16}>{children}</Pane>
  </Pane>
));

export default Card;
