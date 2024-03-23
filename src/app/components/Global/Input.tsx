// Input.tsx
import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  highlightEmpty: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  highlightEmpty,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={label.toLowerCase()}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        value={value}
        placeholder={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 p-2 w-full border rounded-md focus:ring-0 ${
          highlightEmpty && !value ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
};

export default Input;
