import React, {Component} from 'react';
import {title, scrollTop} from 'window';

class Home extends Component {
  componentDidMount() {
    title('');
    scrollTop();
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

export default Home;
