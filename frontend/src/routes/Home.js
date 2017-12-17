import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Col, Row } from 'antd';

class Home extends Component {
  componentDidMount() {
    title('');
    scrollTop();
  }

  render() {
    return (
      <div className="home-screen">
        <Row type="flex" align="middle" justify="center">
          <Col md={12} sm={24}>
            <div className="text-right">
              <img
                src={require('images/app-logo.png')}
                className="app-logo-image"
                alt="budgetal"
              />
            </div>
          </Col>
          <Col md={12} sm={24}>
            <Row type="flex" align="middle" justify="center">
              <Col md={3} sm={24}>
                <img
                  alt="Budgetal"
                  style={{ paddingLeft: '14px', width: '64px' }}
                  src={'/app_logo.png'}
                />
              </Col>
              <Col md={21} sm={24}>
                <span className="app-title">Budgetal</span>
              </Col>
            </Row>
            <Row type="flex" align="center" justify="center">
              <Col span={24}>
                <p className="app-subtitle">
                  Because personal finances<br /> are personal.
                </p>
              </Col>
            </Row>
            <Row type="flex" align="center" justify="center">
              <Col span={24}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://itunes.apple.com/us/app/budgetal-app/id1326525398?mt=8"
                >
                  <img
                    src={require('images/app-store.png')}
                    style={{ height: '75px' }}
                    alt="App Store"
                  />
                </a>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://play.google.com/store/apps/details?id=com.budgetal.app"
                >
                  <img
                    src={require('images/play-store.png')}
                    style={{ height: '75px' }}
                    alt="App Store"
                  />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
