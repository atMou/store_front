"use client";

import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
}

const TextInput = <T extends FieldValues>({
  control,
  name,
  label = "Slug",
  placeholder = "Enter text",
  disabled = false,
  Icon,
}: TextInputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex-1">
          {label && <label className="block text-sm mb-2">{label}</label>}
          <div className="relative">
            <input
              {...field}
              type="text"
              disabled={disabled}
              className="pl-8 pr-4 h-9 w-full border border-black rounded-none text-sm placeholder:text-sm caret-black focus:outline-none focus:bg-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder={isFocused ? "" : placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                field.onBlur();
              }}
            />

            <Icon
              className="absolute left-2.5 top-2.5 text-gray-500"
              size={16}
            />
          </div>
          {fieldState.error && fieldState.isDirty && (
            <p className="text-sm  mt-2 text-red-600">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default TextInput;
