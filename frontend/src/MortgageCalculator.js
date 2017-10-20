import React, {Component} from 'react';
import moment from 'moment';
import MonthChart from 'MonthChart';
import {title, scrollTop} from 'window';
import {currencyf} from 'helpers';
import {connect} from 'react-redux';
import {MORTGAGE_CALCULATOR_UPDATED} from 'action-types';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';

const Option = Select.Option;
const FormItem = Form.Item;

class MortgageCalculator extends Component {
  componentDidMount() {
    title('Mortgage | Calculators');
    scrollTop();
  }

  monthsSinceStart(year, month) {
    const today = new Date();
    const startDate = moment([year, month, 1]);
    const endDate = moment([
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ]);
    return Math.abs(startDate.diff(endDate, 'months', true).toFixed());
  }

  setAndUpdateState = state => {
    this.props.updateState(state);
  };

  handleLoanBalanceChange = e => {
    this.setAndUpdateState({loanBalance: parseInt(e, 10)});
  };

  handleCurrentBalanceChange = e => {
    this.setAndUpdateState({currentBalance: parseInt(e, 10)});
  };

  handleInterestRateChange = interestRate => {
    this.setAndUpdateState({interestRate});
  };

  handleYearChange = e => {
    this.setAndUpdateState({startYear: parseInt(e, 10)});
  };

  handleMonthChange = e => {
    this.setAndUpdateState({startMonth: parseInt(e, 10)});
  };

  handleYearTermChange = e => {
    this.setAndUpdateState({yearTerm: parseInt(e, 10)});
  };

  handleExtraMonthlyPaymentChange = e => {
    this.setAndUpdateState({extraMonthlyPayment: parseFloat(e)});
  };

  pmt(interest, payments, presentValue) {
    const exponent = (interest + 1.0) ** payments;
    const topLine = interest * exponent;
    const bottomLine = exponent - 1.0;
    return presentValue * (topLine / bottomLine);
  }
  render() {
    const {
      currentYear,
      startYear,
      loanBalance,
      startMonth,
      interestRate,
      yearTerm,
      currentBalance,
      extraMonthlyPayment,
    } = this.props;
    const years = [...Array(yearTerm).keys()];

    const interest = interestRate / 100.0 / 12;
    const monthlyPayment = this.pmt(
      interest,
      12 * yearTerm,
      loanBalance,
    ).toFixed(2);
    const completedMonths = this.monthsSinceStart(startYear, startMonth);
    const totalMonths = 12 * yearTerm;

    const firstMonthInterest = parseFloat(
      (currentBalance * interest).toFixed(2),
    );
    const firstMonthPrincipal = monthlyPayment - firstMonthInterest;

    let cv = currentBalance;
    console.log(totalMonths);
    const _months = [...Array(totalMonths).keys()].map((month, i) => {
      const pastMonth = i < completedMonths;
      let _principal = 0.0;
      let _interest = 0.0;
      let _balance = cv;

      if (i === completedMonths) {
        _principal = firstMonthPrincipal + extraMonthlyPayment;
        _interest = firstMonthInterest;
        _balance = cv - _principal;
        cv = _balance;
      } else if (i > completedMonths) {
        _interest = parseFloat((cv * interest).toFixed(2));
        _principal = monthlyPayment - _interest + extraMonthlyPayment;
        _balance = cv - _principal;
        cv = _balance;
      }

      const early = Math.max(_balance, 0) === 0;
      return {
        pastMonth,
        extra: extraMonthlyPayment,
        principal: _principal,
        interest: _interest,
        balance: Math.max(_balance, 0),
        early,
      };
    });

    const earlyMonths = _months.filter(m => m.early).length;

    return (
      <div>
        <h1>Mortgage Calculator</h1>
        <Row>
          <div className="formRow">
            <Col md={11} xs={24} sm={24}>
              <Card noHovering title="Loan Details">
                <Row>
                  <Col span={10}>
                    <FormItem label="Original Balance">
                      <InputNumber
                        defaultValue={loanBalance}
                        max={10000000}
                        min={1000}
                        step={1000}
                        formatter={value =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={this.handleLoanBalanceChange}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10} offset={1}>
                    <FormItem label="Current Balance">
                      <InputNumber
                        defaultValue={currentBalance}
                        max={loanBalance}
                        min={1000}
                        step={1000}
                        formatter={value =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={this.handleCurrentBalanceChange}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <FormItem label="Interest Rate">
                      <InputNumber
                        defaultValue={interestRate}
                        min={0}
                        max={100}
                        step={0.1}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        onChange={this.handleInterestRateChange}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10} offset={1}>
                    <FormItem label="Loan Term">
                      <Select
                        size="large"
                        defaultValue={String(yearTerm)}
                        onChange={this.handleYearTermChange}
                        style={{width: '120px'}}
                      >
                        {[...Array(30).keys()].map(y => {
                          const year = String(y + 1);
                          return (
                            <Option key={y} value={year}>
                              {year} {year === 1 ? 'year' : 'years'}
                            </Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <FormItem label="Origin Date">
                  <Row>
                    <Col span={8}>
                      <Select
                        size="large"
                        defaultValue={String(startMonth)}
                        onChange={this.handleMonthChange}
                        style={{width: '100%'}}
                      >
                        {moment.months().map((m, i) => {
                          return (
                            <Option value={String(i + 1)} key={i}>
                              {m}
                            </Option>
                          );
                        })}
                      </Select>
                    </Col>
                    <Col span={4} offset={1}>
                      <Select
                        size="large"
                        defaultValue={String(startYear)}
                        onChange={this.handleYearChange}
                        style={{width: '100%'}}
                      >
                        {years.map(y => {
                          const year = String(currentYear - y);
                          return (
                            <Option key={y} value={year}>
                              {year}
                            </Option>
                          );
                        })}
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Card>

              <br />
              <br />
            </Col>

            <Col md={2} xs={24} sm={24} />
            <Col md={11} xs={24} sm={24}>
              <Card noHovering title="Extra Payments">
                <Row>
                  <Col span={6}>
                    <FormItem label="Monthly">
                      <InputNumber
                        defaultValue={extraMonthlyPayment}
                        min={0}
                        step={100}
                        formatter={value =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={this.handleExtraMonthlyPaymentChange}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Card>
              <br />
              <br />

              <Card
                noHovering
                title={`${totalMonths} Month Mortgage - ${currencyf(
                  monthlyPayment,
                )}/month`}
              >
                <div className="text-center">
                  Completed <b>{completedMonths}</b> out of{' '}
                  <b>
                    {totalMonths -
                      completedMonths -
                      earlyMonths +
                      completedMonths}
                  </b>{' '}
                  monthly payments
                  <br />
                  <b>{totalMonths - completedMonths - earlyMonths}</b> monthly
                  payments remain.
                </div>
              </Card>
            </Col>
          </div>
        </Row>

        <MonthChart
          months={_months}
          startYear={startYear}
          startMonth={startMonth}
        />
      </div>
    );
  }
}

const updateState = state => {
  return {
    type: MORTGAGE_CALCULATOR_UPDATED,
    state,
  };
};

export default connect(
  state => ({
    ...state.mortgageCalculator,
  }),
  dispatch => ({
    updateState: state => {
      dispatch(updateState(state));
    },
  }),
)(MortgageCalculator);
