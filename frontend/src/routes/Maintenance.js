import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { message, Progress } from 'antd';
import { _raw_get } from 'api';

class Maintenance extends Component {
  state = {
    timer: 15,
    statusLoading: false,
  };

  componentDidMount() {
    title('503 Maintenance');
    scrollTop();
    this.interval = setInterval(this.countDown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkStatus = async () => {
    const hide = message.loading('Checking status...', 0);
    const resp = await _raw_get('/');

    if (resp.status === 503) {
      setTimeout(() => {
        hide();
        message.warning('We are still in maintenance');
        this.setState({ timer: 15 });
        this.interval = setInterval(this.countDown, 1000);
      }, 3000);
    } else {
      setTimeout(() => {
        hide();
        message.success('We are back online!');
        setTimeout(() => {
          window.location = '/';
        }, 500);
      }, 3000);
    }
  };

  countDown = () => {
    const nextTime = this.state.timer - 1;
    const timeout = nextTime < 1;

    if (timeout) {
      clearInterval(this.interval);
      this.checkStatus();
    }
    this.setState({ timer: nextTime });
  };

  render() {
    const { timer } = this.state;
    return (
      <div className="error-page">
        <h1>We are performing scheduled maintenance right now.</h1>
        <hr />
        <p style={{ marginBottom: '15px' }}>Refreshing automatically in</p>
        <div style={{ color: '#1a98fc' }}>
          <Progress
            type="circle"
            status="active"
            percent={timer / 15 * 100}
            format={p => `${timer}`}
          />
        </div>
        <p style={{ marginBottom: '30px' }}>We should be done shortly.</p>
        <img alt="503" src="/500.svg" />
      </div>
    );
  }
}

export default Maintenance;
