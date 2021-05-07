import React from 'react';
import getModal from './index.js';

const Modal = ({ uiState, onHide }) => {
  if (!uiState.type) {
    return null;
  }

  const Component = getModal(uiState.type);
  return <Component modalInfo={uiState} onHide={onHide} />;
};

export default Modal;
