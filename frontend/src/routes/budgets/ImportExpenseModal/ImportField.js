import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Alert, Icon, Pane, Paragraph, Strong, Text } from 'evergreen-ui';

class ImportField extends PureComponent {
  static propTypes = {
    display: PropTypes.oneOf(['none', 'block']).isRequired,
    parseCSV: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
  };

  errors = () => {
    if (this.props.error.length) {
      return <Alert intent="danger" title={this.props.error} />;
    }
  };

  render() {
    const { display, parseCSV } = this.props;

    return (
      <Pane display={display}>
        {this.errors()}
        <Pane
          cursor="pointer"
          textAlign="center"
          marginTop={16}
          height={180}
          onClick={() => {
            this.fileInput.click();
          }}
        >
          <Pane display="none">
            <input
              ref={fileInput => (this.fileInput = fileInput)}
              type="file"
              accept="text/csv"
              onChange={e => {
                e.preventDefault();
                parseCSV(e.target.files[0]);
              }}
            />
          </Pane>
          <Pane>
            <Icon icon="inbox" color="info" size={80} />
          </Pane>
          <Pane>
            <Text>Click to upload CSV</Text>
          </Pane>
          <Pane>
            <Text>File should have 3 headers:</Text>
            <Paragraph>
              <Strong>date, description, amount</Strong>
            </Paragraph>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default ImportField;
