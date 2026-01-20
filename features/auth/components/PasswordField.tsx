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
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  onExtraChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField<T extends FieldValues>({
  control,
  name,
  placeholder,
  onExtraChange,
}: EmailFieldProps<T>) {
  const [isShowen, setIsShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="password" className="text-xs -mb-2">
            Password
          </FieldLabel>
          <InputGroup
            className={`w-full h-11 px-3 text-sm border border-black rounded-none`}
          >
            <InputGroupInput
              id="password"
              placeholder={`${isFocused ? "" : placeholder}`}
              type={isShowen ? "text" : "password"}
              {...field}
              className={`placeholder:text-sm caret-black`}
              onChange={(e) => {
                field.onChange(e);
                onExtraChange(e);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Info"
                    size="icon-xs"
                    onClick={() => setIsShow(!isShowen)}
                  >
                    {isShowen ? <EyeIcon /> : <EyeClosed />}
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  {isShowen ? <p>Hide password</p> : <p>Show password</p>}
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
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

export default PasswordField;
