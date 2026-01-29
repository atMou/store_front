"use client";

import ApiErrorDisplay from "@/components/feedback/ApiErrorDisplay";
import { AppRoutes } from "@/constants";
import GoogleIcon from "@/public/assets/icons/Google.svg";
import {
  Button,
  Checkbox,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
  Logo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { Field, FieldLabel } from "@/shared/ui/field";
import SpinnerIcon from "@/shared/ui/icons/SpinnerIcon";
import { Separator } from "@/shared/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, EyeClosed, EyeIcon, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoginMutation } from "../../api";
import { selectLoginForm } from "../selector";
import { loginActions } from "../slice";
import type { LoginFormSchemaType } from "./loginFormValidation";
import { LoginFormSchema } from "./loginFormValidation";

function LoginForm() {
  const { email, password, rememberMe } = useAppSelector(selectLoginForm);

  const form = useForm<LoginFormSchemaType>({
    defaultValues: {
      email: email || "",
      password: password || "",
    },
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
  });

  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loginMutation, { error: loginError, isError: isLoginError }] =
    useLoginMutation();

  const [isPasswordShowen, setIsPasswordShow] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(loginActions.setPassword(e.target.value));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(loginActions.setEmail(e.target.value));
  };
  const handleRememberMeChange = (checked: boolean) => {
    dispatch(loginActions.setRememberMe(checked));
  };

  const onSubmit = async (data: LoginFormSchemaType) => {
    try {
      await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();

      router.push(AppRoutes.HOME);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex items-center justify-center min-h-screen"
    >
      <div className="flex flex-col space-y-7 w-full max-w-sm p-6">
        <div className="mb-10">
          <Logo />
        </div>
        <div className="flex flex-col space-y-2 mb-2">
          <h1 className="text-2xl font-bold text-black">Welcome Back</h1>
          <p className="text-xs text-gray-600">Sign in to your account</p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email" className="text-xs -mb-2">
                Email
              </FieldLabel>
              <InputGroup className="w-full h-11 px-3 text-sm border border-black rounded-none">
                <InputGroupInput
                  id="email"
                  placeholder={`${isEmailFocused ? "" : "Enter your email"}`}
                  type="email"
                  {...field}
                  className="placeholder:text-sm caret-black"
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e);
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        aria-label="Info"
                        size="icon-xs"
                      >
                        <Mail />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Please only use your personal email</p>
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
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password" className="text-xs -mb-2">
                Password
              </FieldLabel>
              <InputGroup className="w-full h-11 px-3 text-sm border border-black rounded-none">
                <InputGroupInput
                  id="password"
                  placeholder={`${
                    isPasswordFocused ? "" : "Enter your password"
                  }`}
                  type={isPasswordShowen ? "text" : "password"}
                  {...field}
                  className="placeholder:text-sm caret-black"
                  onChange={(e) => {
                    field.onChange(e);
                    handlePasswordChange(e);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        aria-label="Info"
                        size="icon-xs"
                        onClick={() => setIsPasswordShow(!isPasswordShowen)}
                      >
                        {isPasswordShowen ? <EyeIcon /> : <EyeClosed />}
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isPasswordShowen ? (
                        <p>Hide password</p>
                      ) : (
                        <p>Show password</p>
                      )}
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

        <div className="flex items-center gap-2 -mt-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => {
              handleRememberMeChange(checked === true);
            }}
            className="border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label
            htmlFor="rememberMe"
            className="text-xs text-gray-700 font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-black hover:bg-black/80 hover:border font-bold rounded-none"
          disabled={
            form.formState.isSubmitting ||
            (!form.formState.isValid && form.formState.isDirty)
          }
        >
          {form.formState.isSubmitting ? (
            <SpinnerIcon size="20" className="mr-3" />
          ) : (
            <>
              Login{" "}
              <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-2" />{" "}
            </>
          )}
        </Button>

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
            onClick={() => router.push(AppRoutes.GOOGLE_AUTH_LOGIN)}
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
            <span>Don&apos;t have an account? </span>
            <Button
              type="button"
              variant="link"
              className="text-xs text-black hover:underline p-0 h-auto font-medium"
              onClick={() => router.push(AppRoutes.REGISTER)}
            >
              Register
            </Button>
          </div>
          {isLoginError && (
            <ApiErrorDisplay error={loginError} variant="inline" />
          )}
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
