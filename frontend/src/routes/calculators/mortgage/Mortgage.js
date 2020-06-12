import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import MonthChart from './MonthChart';
import { TextInputField, Text, Pane, SelectField } from 'evergreen-ui';

// Helpers
import moment from 'moment';
import { title, scrollTop } from 'window';
import { currencyf } from '@shared/helpers';
import Card from 'components/Card';
import Header from 'components/Header';

class MortgageCalculator extends Component {
  static propTypes = {
    startYear: PropTypes.number.isRequired,
    loanBalance: PropTypes.number.isRequired,
    startMonth: PropTypes.number.isRequired,
    interestRate: PropTypes.number.isRequired,
    yearTerm: PropTypes.number.isRequired,
    currentBalance: PropTypes.number.isRequired,
    extraMonthlyPayment: PropTypes.number.isRequired,
    updateState: PropTypes.func.isRequired,
  };

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

  setAndUpdateState = (state) => {
    this.props.updateState(state);
  };

  handleLoanBalanceChange = (e) => {
    this.setAndUpdateState({ loanBalance: parseInt(e.target.value, 10) });
  };

  handleCurrentBalanceChange = (e) => {
    this.setAndUpdateState({ currentBalance: parseInt(e.target.value, 10) });
  };

  handleInterestRateChange = (e) => {
    this.setAndUpdateState({ interestRate: parseFloat(e.target.value) });
  };

  handleYearChange = (e) => {
    this.setAndUpdateState({ startYear: parseInt(e.target.value, 10) });
  };

  handleMonthChange = (e) => {
    this.setAndUpdateState({ startMonth: parseInt(e.target.value, 10) });
  };

  handleYearTermChange = (e) => {
    this.setAndUpdateState({ yearTerm: parseInt(e.target.value, 10) });
  };

  handleExtraMonthlyPaymentChange = (e) => {
    this.setAndUpdateState({ extraMonthlyPayment: parseFloat(e.target.value) });
  };

  pmt(interest, payments, presentValue) {
    const exponent = (interest + 1.0) ** payments;
    const topLine = interest * exponent;
    const bottomLine = exponent - 1.0;
    return presentValue * (topLine / bottomLine);
  }
  render() {
    const {
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

    let earlyMonths = 0;
    let cv = currentBalance;
    let totalInterest = 0.0;
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
      if (early) {
        earlyMonths++;
      }
      totalInterest = totalInterest + _interest;

      return {
        pastMonth,
        extra: extraMonthlyPayment,
        principal: _principal,
        interest: _interest,
        totalInterest,
        balance: Math.max(_balance, 0),
        early,
      };
    });

    const currentYear = new Date().getFullYear();

    return (
      <Pane>
        <Header
          subtext="See how extra payments can help"
          heading="Mortgage Calculator"
        />
        <Pane
          paddingX={24}
          display="flex"
          flex="1"
          flexDirection="row"
          marginTop={16}
          marginBottom={16}
        >
          <Pane
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="space-between"
            marginRight={32}
          >
            <Card title={'Loan Details'}>
              <Pane display="flex" flexDirection="row">
                <Pane marginRight={32}>
                  <TextInputField
                    type="number"
                    name="balance"
                    max={10000000}
                    min={1000}
                    step={1000}
                    label="Original Balance"
                    value={loanBalance}
                    onChange={this.handleLoanBalanceChange}
                  />
                </Pane>
                <Pane>
                  <TextInputField
                    type="number"
                    name="currentBalance"
                    max={loanBalance}
                    min={1000}
                    step={1000}
                    label="Current Balance"
                    value={currentBalance}
                    onChange={this.handleCurrentBalanceChange}
                  />
                </Pane>
              </Pane>

              <Pane display="flex" flexDirection="row">
                <Pane marginRight={32}>
                  <TextInputField
                    label="Interest Rate"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={interestRate}
                    onChange={this.handleInterestRateChange}
                  />
                </Pane>
                <Pane>
                  <SelectField
                    value={yearTerm}
                    label={'Load Term'}
                    name="year"
                    onChange={this.handleYearTermChange}
                  >
                    <option value={1}>1 Year</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={6}>6 Years</option>
                    <option value={7}>7 Years</option>
                    <option value={8}>8 Years</option>
                    <option value={9}>9 Years</option>
                    <option value={10}>10 Years</option>
                    <option value={11}>11 Years</option>
                    <option value={12}>12 Years</option>
                    <option value={13}>13 Years</option>
                    <option value={14}>14 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={16}>16 Years</option>
                    <option value={17}>17 Years</option>
                    <option value={18}>18 Years</option>
                    <option value={19}>19 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={21}>21 Years</option>
                    <option value={22}>22 Years</option>
                    <option value={23}>23 Years</option>
                    <option value={24}>24 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={26}>26 Years</option>
                    <option value={27}>27 Years</option>
                    <option value={28}>28 Years</option>
                    <option value={29}>29 Years</option>
                    <option value={30}>30 Years</option>
                  </SelectField>
                </Pane>
              </Pane>

              <Pane display="flex" flexDirection="row">
                <SelectField
                  marginRight={4}
                  value={startMonth}
                  label={'Origin Date'}
                  name="month"
                  onChange={this.handleMonthChange}
                >
                  {moment.months().map((m, i) => {
                    return (
                      <option value={String(i + 1)} key={i}>
                        {m}
                      </option>
                    );
                  })}
                </SelectField>
                <SelectField
                  value={startYear}
                  label={<Text color="none">.</Text>}
                  name="startYear"
                  onChange={this.handleYearChange}
                >
                  {years.map((y) => {
                    const year = String(currentYear - y);
                    return (
                      <option key={y} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </SelectField>
              </Pane>
            </Card>
          </Pane>

          <Pane
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Card title={'Extra Payments'}>
              <TextInputField
                label="Monthly"
                type="number"
                value={extraMonthlyPayment}
                onChange={this.handleExtraMonthlyPaymentChange}
              />
            </Card>

            <Card
              marginTop={16}
              title={`${totalMonths} Month Mortgage - ${currencyf(
                monthlyPayment,
              )}/month`}
            >
              <Pane textAlign="center" padding={24}>
                <Text>
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
                </Text>
                <br />
                <Text>
                  Total Interest Paid{' '}
                  <b>{currencyf(totalInterest.toFixed(2))}</b>
                </Text>
              </Pane>
            </Card>
          </Pane>
        </Pane>

        <Pane paddingX={24} marginTop={32}>
          <MonthChart
            months={_months}
            startYear={startYear}
            startMonth={startMonth}
          />
        </Pane>
      </Pane>
    );
  }
}

export default MortgageCalculator;
