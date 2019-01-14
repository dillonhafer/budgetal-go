import React from 'react';

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

export default Form;
