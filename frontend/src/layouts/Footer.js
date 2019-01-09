import React, { Component } from 'react';
import { Layout, Modal } from 'antd';
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
      <Layout.Footer>
        Budgetal © 2013-
        {new Date().getFullYear()} All rights reserved
        <p>
          <Link to="/privacy">Privacy</Link> |{' '}
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
        </p>
        <Modal
          title=""
          wrapClassName="help-modal"
          visible={this.state.showHelpModal}
          footer={null}
          onOk={this.handleHelpClose}
          onCancel={this.handleHelpClose}
        >
          <iframe title="help" src={HELP_FRAME} className="help-frame" />
        </Modal>
        <p>Version 2.1.0 (47)</p>
      </Layout.Footer>
    );
  }
}
