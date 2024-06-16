import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Input from "../src/app/components/Global/Input";

const mockOnChange = jest.fn();

describe("Input component", () => {
  it("should change value correctly", () => {
    const inputProps = {
      label: "Test Input",
      type: "text",
      value: "",
      placeholder: "Enter something...",
      onChange: mockOnChange,
      onSelect: undefined,
      highlightEmpty: false,
      hasError: false,
      className: "",
      readOnly: false,
      onClick: undefined,
      options: [],
    };

    render(<Input {...inputProps} />);

    const inputElement = screen.getByPlaceholderText("Enter something...");
    fireEvent.change(inputElement, { target: { value: "Hello World" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("Hello World");
  });
});
