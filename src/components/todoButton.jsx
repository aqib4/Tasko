import React from "react";

const TodoButton = ({ onClick, label, className, disabled }) => {
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {label}
    </button>
  );
};

export default TodoButton;
