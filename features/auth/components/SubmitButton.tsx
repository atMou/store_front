import { Button } from "@/shared/ui";
import React, { ButtonHTMLAttributes } from "react";
import { FieldValues, FormState } from "react-hook-form";

interface SubmitButtonProps<T extends FieldValues> {
  formState: FormState<T>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: React.ReactNode;
}

function SubmitButton<T extends FieldValues>({
  formState,
  children,
  type,
}: SubmitButtonProps<T>) {
  return (
    <Button
      type={type}
      className="w-full h-10 bg-black hover:bg-gray-800 text-white font-semibold rounded-none transition-colors"
      disabled={
        formState.isSubmitting || !formState.isValid || formState.isLoading
      }
    >
      {formState.isLoading || formState.isSubmitting ? (
        <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <> {children}</>
      )}
    </Button>
  );
}

export default SubmitButton;
