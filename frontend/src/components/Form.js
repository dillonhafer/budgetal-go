import React from 'react';

const formStyles = {
  hiddenSubmit: {
    display: 'none',
  },
};

const Form = ({ children, ...rest }) => (
  <form {...rest}>
    {children}
    <input type="submit" style={formStyles.hiddenSubmit} />
  </form>
);

export default Form;
