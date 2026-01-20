import {
  Field,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { HTMLInputTypeAttribute, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  onExtraChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: React.ComponentType<{ color?: string; size?: number }>;
  IconToopTipText?: string;
  type: HTMLInputTypeAttribute | undefined;
  label: string;
  onBlur?: () => void;
}

function TextField<T extends FieldValues>({
  control,
  name,
  placeholder,
  onExtraChange,
  Icon,
  IconToopTipText,
  type,
  label,
  onBlur,
}: FieldProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className="text-xs -mb-2">
            {label}
          </FieldLabel>

          <InputGroup className="w-full h-11 px-1.5 text-sm border border-black rounded-none">
            <InputGroupInput
              id={name}
              type={type}
              placeholder={isFocused ? "" : placeholder}
              {...field}
              className="placeholder:text-sm caret-black"
              onChange={(e) => {
                field.onChange(e);
                onExtraChange(e);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur?.();
                field.onBlur();
              }}
            />

            {Icon ? (
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Info"
                      size="icon-xs"
                    >
                      {<Icon size={16} color="gray" />}
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    {IconToopTipText}
                    <p></p>
                  </TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            ) : null}
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

export default TextField;
