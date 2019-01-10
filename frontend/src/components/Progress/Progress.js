import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { colors } from '@shared/theme';

export default class Progress extends PureComponent {
  static propTypes = {
    status: PropTypes.oneOf(['normal', 'exception', 'success']),
    percent: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number,
  };

  render() {
    const { status, percent, strokeWidth = 20 } = this.props;
    let color;

    if (status) {
      switch (status) {
        case 'normal':
          color = colors.primary;
          break;
        case 'exception':
          color = colors.error;
          break;
        case 'success':
          color = colors.success;
          break;
        default:
          color = colors.primary;
          break;
      }
    } else {
      if (percent > 100) {
        color = colors.error;
      }
      if (percent === 100) {
        color = colors.success;
      }
    }

    return (
      <div
        style={{
          display: 'block',
          backgroundColor: '#f1f1f1',
          borderColor: '#f1f1f1',
          borderWidth: 1,
          borderRadius: 10,
          height: strokeWidth,
          width: '100%',
        }}
      >
        <div
          className={'____bar-container-innerbar'}
          style={{
            display: 'block',
            backgroundColor: color,
            borderColor: color,
            borderRadius: 10,
            borderWidth: 0,
            height: strokeWidth,
            width: `${percent}%`,
          }}
        />
      </div>
    );
  }
}
