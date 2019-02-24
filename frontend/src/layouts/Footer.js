import React, { Component } from 'react';
import { Link, Paragraph, Pane, Text, Dialog } from 'evergreen-ui';
import { withRouter } from 'react-router';
const HELP_FRAME = process.env.REACT_APP_HELP_FRAME || '';

class Footer extends Component {
  state = {
    showHelpModal: false,
  };

  handlePrivacyClick = () => {
    this.setState({});
    this.props.history.push('/privacy');
  };

  handleHelpClick = () => {
    this.setState({ showHelpModal: true });
  };

  handleHelpClose = () => {
    this.setState({ showHelpModal: false });
  };

  render() {
    return (
      <Pane textAlign="center" paddingBottom={32}>
        <Text>
          Budgetal © 2013-
          {new Date().getFullYear()} All rights reserved
        </Text>
        <Paragraph>
          <Text onClick={this.handlePrivacyClick}>
            <Link cursor="pointer" color="neutral">
              Privacy
            </Link>{' '}
          </Text>
          |{' '}
          <Text onClick={this.handleHelpClick}>
            <Link cursor="pointer" color="neutral">
              Help
            </Link>
          </Text>
        </Paragraph>
        <Dialog
          title="Budgetal Help"
          isShown={this.state.showHelpModal}
          preventBodyScrolling
          hasFooter={false}
          onOk={this.handleHelpClose}
          onCancel={this.handleHelpClose}
          sideOffset={'0px'}
        >
          <iframe
            style={{
              width: '100%',
              border: 'none',
              minHeight: '810px',
            }}
            title="help"
            src={HELP_FRAME}
          />
        </Dialog>
        <Paragraph>Version 2.1.0 (47)</Paragraph>
      </Pane>
    );
  }
}

export default withRouter(Footer);
