/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Modal.js// Inside Modal.js
import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="w-2/3 p-3 bg-white rounded-md">
        <button
          className="absolute text-gray-700 bg-black top-2 right-2 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="category-dropdown">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
