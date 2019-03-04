import React from 'react';

import { cleanCurrencyString } from '@shared/helpers';
import { TextInputField } from 'evergreen-ui';

const formStyles = {
  hiddenSubmit: {
    opacity: 0,
    height: 0,
  },
};

const Form = ({ children, ...rest }) => (
  <form {...rest}>
    {children}
    <div style={formStyles.hiddenSubmit}>
      <input type="submit" />
    </div>
  </form>
);

export const validationMessages = (errors, touched) => {
  return {
    isInvalid: errors && touched,
    validationMessage: touched ? errors : null,
  };
};

export const currencyEvent = event => {
  return {
    target: {
      name: event.target.name,
      value: cleanCurrencyString(event.target.value),
    },
  };
};

export const AmountInputField = ({
  name = 'amount',
  values,
  errors,
  step = 1.0,
  shiftStep = 10.0,
  touched,
  onChange,
  ...rest
}) => (
  <TextInputField
    required
    name={name}
    label="Amount"
    onKeyDown={e => {
      const UP = 38;
      const DOWN = 40;
      let value = parseFloat(e.target.value);
      switch (e.keyCode) {
        case UP:
          const adden = e.shiftKey ? shiftStep : step;
          value = (value + adden).toFixed(2);
          break;
        case DOWN:
          const subtrahend = e.shiftKey ? shiftStep : step;
          value = (value - subtrahend).toFixed(2);
          break;
        default:
          return;
      }

      onChange(
        currencyEvent({
          target: {
            name,
            value,
          },
        }),
      );
    }}
    value={values[name]}
    onChange={e => onChange(currencyEvent(e))}
    placeholder="(10.00)"
    {...validationMessages(errors[name], touched[name])}
    {...rest}
  />
);

export default Form;
