import React from "react";
import PropTypes from "prop-types";

export function IconButton({onClick, children, active, className }) {
  return (
    <button
      className={`inline-flex items-center ${active ? 'bg-blue-500' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func
};
