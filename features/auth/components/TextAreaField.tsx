import {
  Field,
  FieldLabel,
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/shared/ui";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface TextAreaFieldProps<T extends FieldValues> {
  control: Control<T>;
  onExtraChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  defaultRows?: number;
  maxAllowdChars?: number;
  name: Path<T>;
  placeholder?: string;
}
function TextAreaField<T extends FieldValues>({
  control,
  onExtraChange,
  label,
  defaultRows = 4,
  maxAllowdChars = 500,
  name,
  placeholder,
}: TextAreaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="extraDetails" className="text-xs -mb-2">
            {label}
          </FieldLabel>
          <InputGroup className="w-full  py-2 text-sm border border-black rounded-none">
            <InputGroupTextarea
              id="extraDetails"
              placeholder={placeholder}
              rows={defaultRows}
              {...field}
              className="placeholder:text-sm caret-black resize-none"
              onChange={(e) => {
                field.onChange(e);
                onExtraChange(e);
              }}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="text-xs text-gray-500">
                {typeof field.value === "string" ? field.value.length : 0}/
                {maxAllowdChars} characters
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.error && fieldState.isDirty && (
            <p className="-m-2 text-xs pl-2 text-red-600">
              {fieldState.error?.message}
            </p>
          )}
        </Field>
      )}
    />
  );
}

export default TextAreaField;
