import React from "react";

interface ButtonProps {
  label: string;
  onClick: (event: React.FormEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`bg-blue text-white w-full py-2 rounded-1xl focus:outline-none transition duration-300 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
