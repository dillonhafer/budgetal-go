import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Paragraph, Heading } from 'evergreen-ui';

class NoMatch extends Component {
  componentDidMount() {
    title('404 Not Found');
    scrollTop();
  }

  render() {
    return (
      <div className="error-page">
        <Heading size={800}>
          The page you were looking for doesn't exist.
        </Heading>
        <hr
          style={{
            border: 'none',
            borderBottom: '1px solid #e9e9e9',
            marginBottom: '15px',
          }}
        />
        <Paragraph fontFamily="Lato" marginBottom="30px">
          You may have mistyped the address or the page may have moved.
        </Paragraph>
        <img alt="404" src="/404.svg" />
      </div>
    );
  }
}

export default NoMatch;
