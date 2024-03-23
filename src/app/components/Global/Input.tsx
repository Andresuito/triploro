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
  placeholder,
  onChange,
  highlightEmpty,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={label.toLowerCase()}
        className="block font-medium text-gray-700"
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
        className={`mt-1 p-2.5 w-full border rounded-md focus:ring-0 ${
          highlightEmpty && !value ? "border-red-500" : "border-gray-300"
        } text-sm`}
      />
    </div>
  );
};

export default Input;
