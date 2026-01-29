"use client";

import {
  Button,
  Field,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Logo,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

import { AppRoutes } from "@/constants";
import ArrowLink from "@/features/auth/components/ArrowLink";
import CheckboxField from "@/features/auth/components/CheckboxField";
import PasswordField from "@/features/auth/components/PasswordField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import TextField from "@/features/auth/components/TextField";
import { FormSteps } from "@/features/auth/types";
import { useLazyCheckEmailExistsQuery } from "@/features/user/api";
import GoogleIcon from "@/public/assets/icons/Google.svg";
import { TryAsync } from "@/shared/lib/utils";
import { Separator } from "@/shared/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { selectRegisterForm } from "../../selector";
import { registerActions } from "../../slice";
import {
  CredentialsFormSchemaType,
  credentialFormSchema,
} from "../RegisterFormValidation";

function CredentialStep() {
  const dispatch = useAppDispatch();
  const [checkEmail] = useLazyCheckEmailExistsQuery();

  const router = useRouter();

  const { email, phone, password, passwordConfirm, rememberMe } =
    useAppSelector(selectRegisterForm) || {};

  const form = useForm<CredentialsFormSchemaType>({
    defaultValues: {
      email: email || "",
      phone: phone || "",
      password: password || "",
      passwordConfirm: passwordConfirm || "",
      rememberMe: rememberMe || false,
    },
    mode: "onChange",
    resolver: zodResolver(credentialFormSchema),
  });

  const checkEmailExists = async () => {
    if (
      !form.getFieldState("email").invalid &&
      form.getFieldState("email").isDirty
    ) {
      const results = await TryAsync(async () => {
        return await checkEmail({ email: form.getValues("email") }).unwrap();
      });

      console.log("Raw results:", results);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(registerActions.setPassword(e.target.value));
    const pc = form.getFieldState("passwordConfirm");
    if (pc.isDirty) {
      form.trigger("passwordConfirm");
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("✅ SUBMITTING:", data);
            dispatch(registerActions.setStep(FormSteps.PROFILE));
          },
          (errors) => console.log("❌ Validation failed:", errors)
        )}
        noValidate
        className="flex items-center justify-center min-h-screen"
      >
        <div className="flex flex-col space-y-4 w-full max-w-sm p-6">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="flex flex-col space-y-2 mb-5">
            <h1 className="text-2xl font-bold text-black">Create Account</h1>
            <p className="text-xs text-gray-600">
              Step 1 of 3 - Enter your credentials
            </p>
            <div className="flex gap-2 mt-1">
              <div className="h-1 flex-1 bg-black rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <TextField
            control={form.control}
            name="email"
            placeholder="Enter your email"
            onExtraChange={(e) => {
              dispatch(registerActions.setEmail(e.target.value));
            }}
            IconToopTipText="Please only use your personal email"
            Icon={Mail}
            type="email"
            label="Email"
            onBlur={() => {
              checkEmailExists();
            }}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone" className="text-xs -mb-2">
                  Phone
                </FieldLabel>
                <InputGroup className="w-full h-11 px-3 text-sm border border-black rounded-none">
                  <PhoneInput
                    country="de"
                    value={field.value}
                    onChange={(value: string) => {
                      field.onChange(value);
                      dispatch(registerActions.setPhone(value));
                    }}
                    inputProps={{
                      name: field.name,
                      id: "phone",
                      className:
                        "w-full border-0 !pl-12 text-sm placeholder:text-sm caret-black",
                    }}
                    containerClass="!w-full"
                    inputClass="w-full !bg-transparent !border-0 !shadow-none !outline-none !ring-0"
                    buttonClass="!border-0  hover:bg-inherit! shadow-none!"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText className="text-gray-500">
                      <Phone className="w-4 h-4" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                {}
                {fieldState.error && fieldState.isDirty && (
                  <p className="-m-2 text-xs pl-2 text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          <PasswordField
            control={form.control}
            name="password"
            placeholder="Enter your password"
            onExtraChange={handlePasswordChange}
          />
          <PasswordField
            control={form.control}
            name="passwordConfirm"
            placeholder="Enter repeat password"
            onExtraChange={(e) => {
              dispatch(registerActions.setPasswordConfirm(e.target.value));
            }}
          />

          <div className="flex items-center gap-2 -mt-2">
            <CheckboxField
              id="rememberMe"
              name="rememberMe"
              control={form.control}
              onCheckedChange={(checked) => {
                dispatch(registerActions.setRememberMe(checked));
              }}
              label="Remember me"
            />
          </div>
          <SubmitButton formState={form.formState} type="submit">
            {
              <>
                Next{" "}
                <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-2" />{" "}
              </>
            }
          </SubmitButton>
          <div className="flex justify-end">
            {}
            <ArrowLink
              direction="right"
              rightText="Next"
              disabled={!form.formState.isValid}
              onClickLeft={() =>
                dispatch(registerActions.setStep(FormSteps.PROFILE))
              }
            />
          </div>

          <div className="text-sm text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 my-4">
              <Separator
                decorative
                orientation="horizontal"
                className="flex-1 bg-black"
              />
              or
              <Separator
                decorative
                orientation="horizontal"
                className="flex-1 bg-black"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border border-black hover:bg-gray-50 rounded-none font-medium flex items-center justify-center gap-2"
              onClick={() => router.push(AppRoutes.GOOGLE_AUTH_REGISTER)}
            >
              <Image
                src={GoogleIcon}
                alt="Google"
                className="h-5 w-5"
                width={20}
                height={20}
              />
              <span className="text-sm">Continue with Google</span>
            </Button>
            <div className="mt-4 text-xs text-gray-700">
              <span>You have an account? </span>
              <Button
                type="button"
                variant="link"
                className="text-xs text-black hover:underline p-0 h-auto font-medium"
                onClick={() => router.push(AppRoutes.LOGIN)}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default CredentialStep;
