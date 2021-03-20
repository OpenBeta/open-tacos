import React from "react";

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