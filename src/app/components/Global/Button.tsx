// Button.tsx
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gray-500 text-white w-full py-2 rounded-md hover:bg-sky-900 focus:outline-none transition duration-200 mt-6"
    >
      {label}
    </button>
  );
};

export default Button;
