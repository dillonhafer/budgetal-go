import React, { Component } from 'react';
import { title, scrollTop } from 'window';

class Home extends Component {
  componentDidMount() {
    title('');
    scrollTop();
  }

  render() {
    return (
      <div className="text-center">
        <h1>Budgetal</h1>
        <img alt="Budgetal" style={{ width: '64px' }} src={'/app_logo.png'} />
      </div>
    );
  }
}

export default Home;
