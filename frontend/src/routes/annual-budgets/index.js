import React, {Component} from 'react';
import {title, scrollTop} from 'window';

class AnnualBudget extends Component {
  componentDidMount() {
    title(`Annual Budget ${this.props.match.params.year}`);
    scrollTop();
  }

  render() {
    const {year} = this.props.match.params;
    return <h1>Annual Budget for {year}</h1>;
  }
}

export default AnnualBudget;
