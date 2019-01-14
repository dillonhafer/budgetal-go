import React from 'react';
import './circle.css';

const Circle = ({ percent, text = '', size = 'med', color = '#2db7f5' }) => {
  let appliedRadius;
  let appliedStroke;
  switch (size) {
    case 'xs':
      appliedRadius = 10;
      appliedStroke = 1;
      break;
    case 'sm':
      appliedRadius = 25;
      appliedStroke = 2.5;
      break;
    case 'med':
      appliedRadius = 50;
      appliedStroke = 5;
      break;
    case 'lg':
      appliedRadius = 75;
      appliedStroke = 7.5;
      break;
    case 'xl':
      appliedRadius = 100;
      appliedStroke = 10;
      break;
    default:
      appliedRadius = 50;
      appliedStroke = 5;
  }
  const normalizedRadius = appliedRadius - appliedStroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ display: 'inline-block' }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
          lineHeight: 1,
          width: 150,
          height: 150,
          fontSize: 27,
        }}
      >
        <div
          style={{
            transform: 'rotate(-90deg)',
          }}
        >
          <svg height={appliedRadius * 2} width={appliedRadius * 2}>
            <circle
              className="ProgressCircle_background"
              fill="transparent"
              stroke="#f5f5f5"
              transformOrigin="50% 50%"
              transform="rotate(-90deg)"
              strokeWidth={appliedStroke}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={appliedRadius}
              cy={appliedRadius}
            />
            <circle
              className="ProgressCircle_circle"
              stroke={color}
              fill={'transparent'}
              strokeLinecap="round"
              strokeWidth={appliedStroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={appliedRadius}
              cy={appliedRadius}
            />
          </svg>
        </div>
        <span
          className="ProgressCircle_text"
          style={{
            color,
            fontSize: '1em',
            verticalAlign: 'middle',
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            lineHeight: 1,
            top: '52%',
            left: '-2px',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
export default Circle;
