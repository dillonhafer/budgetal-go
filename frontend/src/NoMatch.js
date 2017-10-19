import React, {Component} from 'react';
import {title, scrollTop} from './window';

class NoMatch extends Component {
  componentDidMount() {
    title('404 Not Found');
    scrollTop();
  }

  render() {
    return <h1>Oh no! We cant find that page</h1>;
  }
}

export default NoMatch;
