"use client";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextAreaInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const TextAreaInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  rows = 4,
}: TextAreaInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label className="block text-xs mb-2">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
          <textarea
            {...field}
            rows={rows}
            placeholder={placeholder}
            className="px-3 py-2 w-full border border-black rounded-none text-sm placeholder:text-sm caret-black focus:outline-none"
          />
          {fieldState.error && (
            <p className="text-xs pl-2 mt-1 text-red-600">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default TextAreaInput;
