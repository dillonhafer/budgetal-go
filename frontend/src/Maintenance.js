import React, {Component} from 'react';
import {title, scrollTop} from 'window';

class Maintenance extends Component {
  componentDidMount() {
    title('503 Maintenance');
    scrollTop();
  }

  render() {
    return (
      <div className="error-page">
        <h1>We are performing scheduled maintenance right now.</h1>
        <hr />
        <p>We should be done shortly.</p>
      </div>
    );
  }
}

export default Maintenance;
