import React, {Component} from 'react';

class NoMatch extends Component {
  componentDidMount() {
    window.title('404 Not Found');
    window.scrollTop();
  }
  render() {
    return <h1>Oh no! We cant find that page</h1>;
  }
}

export default NoMatch;
