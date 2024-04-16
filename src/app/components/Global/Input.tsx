import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  highlightEmpty: boolean;
  hasError: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  highlightEmpty,
  hasError,
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={label.toLowerCase()}
        className="block text-sm text-gray-700 text-start"
      >
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-4 p-2.5  border  rounded-1xl  ${
          (highlightEmpty && !value) || hasError
            ? "border-red-500"
            : "border-[#333333]/50"
        } text-sm ${className}`}
      />
    </div>
  );
};

export default Input;
