import React, {Component} from 'react';
import {title, scrollTop} from 'window';

class NoMatch extends Component {
  componentDidMount() {
    title('404 Not Found');
    scrollTop();
  }

  render() {
    return (
      <div className="error-page">
        <h1>The page you were looking for doesn't exist.</h1>
        <hr />
        <p>You may have mistyped the address or the page may have moved.</p>
      </div>
    );
  }
}

export default NoMatch;
