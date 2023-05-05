import React, { useState } from 'react';

import '../styles/Modal.css';

function Modal({ children, isOpen, toggleOpen }) {
  function handleOverlayClick() {
    toggleOpen();
  }

  function handleContentClick(e) {
    e.stopPropagation();
  }

  return (
    <>
      {isOpen && (
        <div className='modal-overlay' onClick={handleOverlayClick}>
          <div
            className='modal-content content-container'
            onClick={handleContentClick}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
