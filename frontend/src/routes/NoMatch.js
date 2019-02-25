import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Pane, Paragraph, Heading } from 'evergreen-ui';
import { colors } from '@shared/theme';

class NoMatch extends Component {
  componentDidMount() {
    title('404 Not Found');
    scrollTop();
  }

  render() {
    return (
      <Pane width={700} textAlign="center" marginY={84} marginX="auto">
        <Heading size={800} color={colors.primary}>
          The page you were looking for doesn't exist.
        </Heading>
        <hr
          style={{
            border: 'none',
            borderBottom: '1px solid #e9e9e9',
            marginBottom: '15px',
          }}
        />
        <Paragraph
          fontSize="1rem"
          lineHeight="1.6rem"
          fontFamily="Lato"
          marginBottom="30px"
        >
          You may have mistyped the address or the page may have moved.
        </Paragraph>
        <img alt="404" src="/404.svg" />
      </Pane>
    );
  }
}

export default NoMatch;
