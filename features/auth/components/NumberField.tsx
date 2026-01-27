import { Field, FieldLabel, InputGroup, InputGroupInput } from "@/shared/ui";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface NumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  onExtraChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}
function NumberField<T extends FieldValues>({
  control,
  label,
  name,
  onExtraChange,
  placeholder,
}: NumberFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="flex-1">
          <FieldLabel htmlFor={name} className="text-xs -mb-2">
            {label}
          </FieldLabel>
          <InputGroup className="w-full h-10 px-1.5  text-sm border border-black rounded-none">
            <InputGroupInput
              id={name}
              placeholder={placeholder}
              type="number"
              inputMode="numeric"
              pattern="\d*"
              {...field}
              value={field.value ?? ""}
              className="placeholder:text-sm caret-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                field.onChange(isNaN(value) ? undefined : value);
                onExtraChange?.(e);
              }}
            />
          </InputGroup>
          {fieldState.error && fieldState.isDirty && (
            <p className="-m-2 text-xs pl-2 text-red-600">
              {fieldState.error.message}
            </p>
          )}
        </Field>
      )}
    />
  );
}

export default NumberField;
