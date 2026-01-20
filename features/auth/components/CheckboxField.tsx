import { Checkbox, Label } from "@/shared/ui";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  className?: string;
  control: Control<T>;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

function CheckboxField<T extends FieldValues>({
  id,
  control,
  onCheckedChange,
  name,
  label,
}: CheckboxProps<T>) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              onCheckedChange(checked === true ? true : false);
            }}
            className="border-black  rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
        )}
      />
      <Label
        htmlFor={id}
        className="text-xs text-gray-700 font-normal cursor-pointer"
      >
        {label}
      </Label>
    </>
  );
}

export default CheckboxField;
