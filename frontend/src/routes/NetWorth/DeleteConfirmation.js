import React from 'react';
import { Alert, Dialog, Paragraph } from 'evergreen-ui';
import PropTypes from 'prop-types';

const DeleteConfirmation = ({
  title,
  message,
  isShown,
  isConfirmLoading,
  onConfirm,
  onCloseComplete,
}) => (
  <Dialog
    preventBodyScrolling
    width={450}
    intent="danger"
    hasHeader={false}
    confirmLabel={`Delete`}
    isConfirmLoading={isConfirmLoading}
    onConfirm={onConfirm}
    onCloseComplete={onCloseComplete}
    isShown={isShown}
  >
    <Alert intent="danger" title={title}>
      <Paragraph>{message}</Paragraph>
    </Alert>
  </Dialog>
);

DeleteConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isShown: PropTypes.bool.isRequired,
  isConfirmLoading: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCloseComplete: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
