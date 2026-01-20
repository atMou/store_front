"use client";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface NumberInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: number;
  isInteger?: boolean;
  Icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const NumberInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  step = "1",
  min = 0,
  isInteger = false,
  Icon,
}: NumberInputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          if (inputValue === "" || inputValue === "-") {
            field.onChange("");
            return;
          }

          const parsedValue = isInteger
            ? parseInt(inputValue)
            : parseFloat(inputValue);

          if (!isNaN(parsedValue)) {
            field.onChange(parsedValue);
          }
        };

        return (
          <div>
            <label className="block text-xs mb-2">
              {label} {required && <span className="text-red-600">*</span>}
            </label>
            <div className="relative">
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon size={16} className="text-gray-600" />
                </div>
              )}
              <input
                type="number"
                value={field.value ?? ""}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  setIsFocused(false);
                  field.onBlur();
                }}
                step={step}
                min={min}
                placeholder={isFocused ? "" : placeholder}
                className={`h-9 w-full border border-black rounded-none text-sm placeholder:text-sm caret-black focus:outline-none focus:bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${Icon ? "pl-8 pr-1" : "px-1"}`}
              />
            </div>
            {fieldState.error && (
              <p className="text-xs pl-2 mt-1 text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default NumberInput;
