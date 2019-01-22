import React, { Component } from 'react';
import { Paragraph, Pane, Text, Dialog } from 'evergreen-ui';
import { Link } from 'react-router-dom';
const HELP_FRAME = process.env.REACT_APP_HELP_FRAME || '';

export default class Footer extends Component {
  state = {
    showHelpModal: false,
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
          <Link
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              color: '#444',
            }}
            to="/privacy"
          >
            Privacy
          </Link>{' '}
          |{' '}
          <button
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              color: '#444',
            }}
            onClick={this.handleHelpClick}
          >
            Help
          </button>
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
