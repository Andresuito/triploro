import React, { useState, useEffect } from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  highlightEmpty: boolean;
  hasError: boolean;
  className?: string;
  readOnly?: boolean;
  onClick?: () => void;
  autocomplete?: "on" | "off";
  options?: string[];
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  onSelect,
  highlightEmpty,
  hasError,
  className = "",
  readOnly = false,
  onClick,
  autocomplete = "off",
  options = [],
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (autocomplete === "on") {
      setShowOptions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowOptions(false), 200);
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    if (onSelect) {
      onSelect(option);
    }
    setShowOptions(false);
  };

  return (
    <div className="mb-4 relative">
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
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={`mt-4 p-2.5  border  rounded-1xl  ${
          (highlightEmpty && !value) || hasError
            ? "border-red-500"
            : "border-[#333333]/50"
        } text-sm ${className}`}
        readOnly={readOnly}
        onClick={onClick}
        autoComplete={autocomplete}
        onFocus={() => setShowOptions(true)}
      />
      {showOptions && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full">
          {options
            .filter((option) =>
              option.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 3)
            .map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className="p-2 hover:bg-blue hover:text-white text-blue cursor-pointer"
              >
                {option}
              </div>
            ))}
          {options.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          ).length === 0 && (
            <div className="p-2 text-gray-500">No se ha encontrado</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
