import React from "react";

export function IconButton({ onClick, children, active, text, className }) {
  return (
    <button
      className={`inline-flex justify-center items-center ${
        active ? "bg-blue-500" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
      {text && <span className="ml-1 text-sm underline">{text}</span>}
    </button>
  );
}
