import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Pane } from 'evergreen-ui';

class Home extends Component {
  componentDidMount() {
    title('');
    scrollTop();
  }

  render() {
    return (
      <Pane className="home-screen">
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          minWidth={380}
          flexWrap={'wrap'}
        >
          <Pane
            minWidth={380}
            display="flex"
            flexDirection="column"
            flex="1 0 40%"
          >
            <div className="text-right">
              <img
                src={require('images/app-logo.png')}
                className="app-logo-image"
                alt="budgetal"
              />
            </div>
          </Pane>
          <Pane
            minWidth={380}
            display="flex"
            flexDirection="column"
            flex="1 0 40%"
          >
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
                <img
                  alt="Budgetal"
                  style={{ margin: '14px', width: '64px' }}
                  src={'/app_logo.png'}
                />
              </Pane>
              <Pane>
                <span className="app-title">Budgetal</span>
              </Pane>
            </Pane>
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
                <p className="app-subtitle">
                  Because personal finances
                  <br /> are personal.
                </p>
              </Pane>
            </Pane>
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
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
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default Home;
