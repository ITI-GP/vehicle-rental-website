import React from 'react';

const Button = ({ children, style, className = '', ...props }) => {
  return (
    <button
      className={`btn ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; // <-- this line is important
