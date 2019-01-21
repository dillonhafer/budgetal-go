import React, { PureComponent } from 'react';

// Components
import { Table, Heading, Pane, Button, Text } from 'evergreen-ui';
import DeleteConfirmation from 'components/DeleteConfirmation';
import Spinner from 'components/Spinner';

// API
import { EndSessionRequest, AllSessionsRequest } from '@shared/api/sessions';

// Helpers
import { humanUA } from '@shared/helpers';
import { notice, error } from 'window';
import moment from 'moment';
import sortBy from 'lodash/sortBy';

// Icons
import GoogleChromeIcon from 'mdi-react/GoogleChromeIcon';
import InternetExplorerIcon from 'mdi-react/InternetExplorerIcon';
import AppleSafariIcon from 'mdi-react/AppleSafariIcon';
import FirefoxIcon from 'mdi-react/FirefoxIcon';
import AppleIcon from 'mdi-react/AppleIcon';
import AndroidIcon from 'mdi-react/AndroidIcon';
import EarthIcon from 'mdi-react/EarthIcon';
import EdgeIcon from 'mdi-react/EdgeIcon';
import OperaIcon from 'mdi-react/OperaIcon';

const uaIcons = {
  earth: <EarthIcon />,
  chrome: <GoogleChromeIcon className="chrome-icon" />,
  explorer: <InternetExplorerIcon className="explorer-icon" />,
  safari: <AppleSafariIcon className="safari-icon" />,
  firefox: <FirefoxIcon className="firefox-icon" />,
  ios: <AppleIcon className="ios-icon" />,
  android: <AndroidIcon className="android-icon" />,
  edge: <EdgeIcon className="edge-icon" />,
  opera: <OperaIcon className="opera-icon" />,
};

class SessionsTable extends PureComponent {
  state = {
    loading: true,
    showDeleteConfirmation: false,
    isDeleting: false,
    sessions: {
      active: [],
      expired: [],
    },
  };

  componentDidMount = () => {
    this.fetchSessions();
  };

  fetchSessions = async () => {
    return AllSessionsRequest()
      .then(resp => {
        if (resp.ok) {
          const sessions = {
            ...resp.sessions,
            active: sortBy(
              resp.sessions.active,
              session => moment(session.createdAt).unix(),
              ['desc'],
            ).reverse(),
          };
          this.setState({ loading: false, sessions });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        error('Something went wrong');
        this.setState({ loading: false });
      });
  };

  handleOnClick = session => {
    this.sessionToEnd = session;
    this.setState({ showDeleteConfirmation: true });
  };

  browser(session) {
    const hua = humanUA(session.userAgent);
    let icon = 'earth';

    if (/chrome/i.test(hua)) {
      icon = 'chrome';
    }

    if (/ie/i.test(hua)) {
      icon = 'explorer';
    }

    if (/edge/i.test(hua)) {
      icon = 'edge';
    }

    if (/safari/i.test(hua)) {
      icon = 'safari';
    }

    if (/firefox/i.test(hua)) {
      icon = 'firefox';
    }

    if (/iOS/i.test(hua)) {
      icon = 'ios';
    }

    if (/Android/i.test(hua)) {
      icon = 'android';
    }

    if (/opera/i.test(hua)) {
      icon = 'opera';
    }

    return (
      <div
        className="ua-icons"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {uaIcons[icon]}
        {hua}
        {session.deviceName ? ` - ${session.deviceName}` : ''}
      </div>
    );
  }

  sessionDate = date => {
    const mDate = moment(date);
    const dayDifference = moment().diff(mDate, 'days');

    if (dayDifference >= 7) {
      const format = 'dddd, MMM Do YYYY, h:mm a';
      return mDate.format(format);
    } else {
      return mDate.fromNow();
    }
  };

  endSession = async () => {
    const session = this.sessionToEnd;
    this.setState({ isDeleting: true });

    return EndSessionRequest(session.authenticationKey)
      .then(resp => {
        if (resp.ok) {
          notice('Session Signed Out');
          const { active, expired } = this.state.sessions;
          const activeIndex = active.findIndex(
            s => s.authenticationKey === session.authenticationKey,
          );

          this.setState({
            isDeleting: false,
            showDeleteConfirmation: false,
            sessions: {
              active: [
                ...active.slice(0, activeIndex),
                ...active.slice(activeIndex + 1),
              ],
              expired: [...expired, { ...session, expiredAt: moment() }],
            },
          });
        }
      })
      .catch(() => {
        this.setState({
          isDeleting: false,
          showDeleteConfirmation: false,
        });
        error('Something went wrong');
      });
  };

  render() {
    const { loading, sessions } = this.state;
    const currentToken = localStorage.getItem('_budgetal_session');

    return (
      <Pane marginTop={16}>
        <Pane
          background="white"
          border="muted"
          borderRadius={16}
          marginBottom={32}
        >
          <Heading size={600} padding={16}>
            Active Sessions
          </Heading>
          <Spinner visible={loading} />
          {!loading && (
            <Table>
              <Table.Head accountForScrollbar>
                <Table.TextHeaderCell>Device</Table.TextHeaderCell>
                <Table.TextHeaderCell>IP Address</Table.TextHeaderCell>
                <Table.TextHeaderCell>Signed In</Table.TextHeaderCell>
                <Table.TextHeaderCell />
              </Table.Head>
              <Table.Body>
                {sessions.active.map(session => (
                  <Table.Row key={`${session.authenticationKey}`}>
                    <Table.TextCell>{this.browser(session)}</Table.TextCell>
                    <Table.TextCell isNumber>
                      {session.ipAddress}
                    </Table.TextCell>
                    <Table.TextCell>
                      {this.sessionDate(session.createdAt)}
                    </Table.TextCell>
                    <Table.TextCell align="right" marginRight={16}>
                      {session.authenticationToken === currentToken ? (
                        '(Current Session)'
                      ) : (
                        <Button
                          height={32}
                          iconBefore="log-out"
                          intent="danger"
                          onClick={() => this.handleOnClick(session)}
                        >
                          End Session
                        </Button>
                      )}
                    </Table.TextCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Pane>

        <Pane background="white" border="muted" borderRadius={16}>
          <Heading size={600} padding={16}>
            Expired Sessions (last 10)
          </Heading>
          <Spinner visible={loading} />
          {!loading && (
            <Table>
              <Table.Head accountForScrollbar>
                <Table.TextHeaderCell>Device</Table.TextHeaderCell>
                <Table.TextHeaderCell>IP Address</Table.TextHeaderCell>
                <Table.TextHeaderCell>Signed In</Table.TextHeaderCell>
                <Table.TextHeaderCell>Signed Out</Table.TextHeaderCell>
              </Table.Head>
              <Table.Body>
                {sessions.expired.map(session => (
                  <Table.Row key={`${session.authenticationKey}`}>
                    <Table.TextCell>{this.browser(session)}</Table.TextCell>
                    <Table.TextCell isNumber>
                      {session.ipAddress}
                    </Table.TextCell>
                    <Table.TextCell>
                      {this.sessionDate(session.createdAt)}
                    </Table.TextCell>
                    <Table.TextCell>
                      {this.sessionDate(session.expiredAt)}
                    </Table.TextCell>
                  </Table.Row>
                ))}
                {sessions.expired.length === 0 && (
                  <Table.Row>
                    <Table.TextCell>
                      You don't have any expired sessions yet.
                    </Table.TextCell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </Pane>

        <DeleteConfirmation
          title="End Session?"
          message={
            <Text display="block">
              <Text>Are you sure you want to end this session?</Text>
              <Text display="block" marginTop={8}>
                This will sign out the device using it. And you will need to
                sign in again on that device.
              </Text>
            </Text>
          }
          isShown={this.state.showDeleteConfirmation}
          isConfirmLoading={this.state.isDeleting}
          onConfirm={this.endSession}
          onCloseComplete={() => {
            this.setState({ showDeleteConfirmation: false });
          }}
        />
      </Pane>
    );
  }
}

export default SessionsTable;
