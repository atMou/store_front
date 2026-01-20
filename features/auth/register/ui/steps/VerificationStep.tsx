"use client";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";

import { ApiErrorDisplay } from "@/components/feedback/ApiErrorDisplay";
import {
  useResendVerificationCodeMutation,
  useVerifyEmailMutation,
} from "@/features/auth/api";
import SubmitButton from "@/features/auth/components/SubmitButton";
import { FormSteps } from "@/features/auth/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectRegisterForm } from "../../selector";
import { registerActions } from "../../slice";
import {
  codeVerificationSchema,
  CodeVerificationSchema,
} from "../RegisterFormValidation";

function VerificationStep() {
  const [verifyEmail, { isError: IsVerifyError, error: verifyError }] =
    useVerifyEmailMutation();
  const [resendCode, { isError: isResendError, error: resendError }] =
    useResendVerificationCodeMutation();

  const email = useAppSelector(selectRegisterForm).email!;

  const dispach = useAppDispatch();

  const form = useForm<CodeVerificationSchema>({
    resolver: zodResolver(codeVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(_data: CodeVerificationSchema) {
    await verifyEmail({
      email: email,
      code: _data.code,
    }).unwrap();

    if (!IsVerifyError && !isResendError) {
      dispach(registerActions.setStep(FormSteps.COMPLETED));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="flex flex-col space-y-7 w-full max-w-sm p-6">
          <div className="flex flex-col space-y-2 mb-5">
            <h1 className="text-2xl font-bold text-black">Verify Your Email</h1>
            <p className="text-xs text-gray-600">
              Step 3 of 3 - Enter the code sent to your email
            </p>
            <div className="flex gap-2 mt-1">
              <div className="h-1 flex-1 bg-black rounded-full"></div>
              <div className="h-1 flex-1 bg-black rounded-full"></div>
              <div className="h-1 flex-1 bg-black rounded-full"></div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs -m-1">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="gap-0.5">
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-12 h-12 border-black border text-base rounded-none"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="text-xs text-gray-600">
                  Please enter the 6-digit code sent to your email.
                </FormDescription>
                <p className="text-xs text-gray-700">
                  Didn&apos;t get your code?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-black hover:underline p-0 h-auto font-medium"
                    onClick={() =>
                      resendCode({ email: "mustafaamamaar@yahoo.com" })
                    }
                  >
                    Resend code
                  </Button>
                </p>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {(IsVerifyError || isResendError) && (
            <div className="space-y-2">
              {IsVerifyError && (
                <ApiErrorDisplay error={verifyError} variant="inline" />
              )}
              {isResendError && (
                <ApiErrorDisplay error={resendError} variant="inline" />
              )}
            </div>
          )}

          <SubmitButton formState={form.formState} type="submit">
            <>Verify</>
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

export default VerificationStep;
