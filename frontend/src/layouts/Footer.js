import React, { Component } from 'react';
import { Paragraph, Pane, Text, Dialog } from 'evergreen-ui';
import { Link } from 'react-router-dom';
import { colors } from '@shared/theme';
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
          padding={0}
        >
          <iframe
            style={{
              background: colors.primary,
              width: '100%',
              border: 'none',
              minHeight: '975px',
            }}
            title="help"
            src={HELP_FRAME}
            className="help-frame"
          />
        </Dialog>
        <Paragraph>Version 2.1.0 (47)</Paragraph>
      </Pane>
    );
  }
}
