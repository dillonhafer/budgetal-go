import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {title, scrollTop} from './window';

class MortgageCalculator extends Component {
  componentDidMount() {
    title('Mortgage | Calculators');
    scrollTop();
  }
  render() {
    return (
      <div>
        <h1>Mortgage Calculator</h1>
        <Link to={`/annual-budgets/${2017}`}>Annual Budgets</Link>
      </div>
    );
  }
}

export default MortgageCalculator;
