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
  touched,
  onChange,
  ...rest
}) => (
  <TextInputField
    required
    name={name}
    label="Amount"
    value={values[name]}
    onChange={e => onChange(currencyEvent(e))}
    placeholder="(10.00)"
    {...validationMessages(errors[name], touched[name])}
    {...rest}
  />
);

export default Form;
