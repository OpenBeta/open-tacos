import React from "react";
import { Link } from "gatsby"

/**
 *  TODO: Create MaterialUI-like button with standard styles such as
 *  primary|secondary|default
 */
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

export function TextButton({ label, to }) {
  return (
    <button className="border rounded-lg bg-gray-200 text-xs py-1 px-2">
      <Link to={to}>{label}</Link>
    </button>
  );
}
