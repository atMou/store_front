"use client";

import { Field, FieldLabel, Form, Label } from "@/shared/ui";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Upload, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ProfileFormSchema,
  type ProfileFormSchemaType,
} from "../RegisterFormValidation";

import { useRegisterMutation } from "@/features/auth/api";
import NumberField from "@/features/auth/components/NumberField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import TextAreaField from "@/features/auth/components/TextAreaField";
import TextField from "@/features/auth/components/TextField";
import { FormSteps } from "@/features/auth/types";
import useToast from "@/hooks/ui/useToast";
import { TryAsync } from "@/shared";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectRegisterForm } from "../../selector";
import { registerActions } from "../../slice";

function ProfileSep() {
  const [register] = useRegisterMutation();
  const { showToast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    city,
    street,
    postalCode,
    houseNumber,
    extraDetails,
  } = useAppSelector(selectRegisterForm) || {};

  const dispatch = useAppDispatch();

  const form = useForm<ProfileFormSchemaType>({
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      age: age ?? undefined,
      gender: gender || undefined,
      city: city || "",
      street: street || "",
      postalCode: postalCode ?? undefined,
      houseNumber: houseNumber ?? undefined,
      extraDetails: extraDetails || "",
      avatar: undefined,
    },
    mode: "all",
    resolver: zodResolver(ProfileFormSchema),
  });

  const onSubmit = async (_data: ProfileFormSchemaType) => {
    const formData = new FormData();

    formData.append("Email", email!);
    formData.append("Password", password!);
    formData.append("FirstName", _data.firstName || "");
    formData.append("LastName", _data.lastName || "");
    formData.append("City", _data.city || "");
    formData.append("Street", _data.street || "");
    formData.append("PostalCode", (_data.postalCode || 0).toString());
    formData.append("HouseNumber", (_data.houseNumber || 0).toString());
    formData.append("RememberMe", "false");

    if (_data.age) {
      formData.append("Age", _data.age.toString());
    }
    if (_data.gender) {
      formData.append("Gender", _data.gender);
    }
    if (_data.extraDetails) {
      formData.append("ExtraDetails", _data.extraDetails);
    }
    if (_data.avatar instanceof File) {
      formData.append("Avatar", _data.avatar);
    }

    const { data, error } = await TryAsync(async () => {
      return await register(formData).unwrap();
    });

    if (error) {
      showToast({ message: error.errors[0], type: "error" });
      return;
    }

    dispatch(registerActions.setStep(FormSteps.VERIFICATION));

    console.log("Registration results:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="flex flex-col space-y-4 w-full max-w-md p-6">
          <div className="flex flex-col space-y-2 mb-2">
            <h1 className="text-2xl font-bold text-black">
              Complete Your Profile
            </h1>
            <p className="text-xs text-gray-600">
              Step 2 of 3 - Tell us more about yourself
            </p>
            <div className="flex gap-2 mt-1 mb-1">
              <div className="h-1 flex-1 bg-black rounded-full"></div>
              <div className="h-1 flex-1 bg-black rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <TextField
              control={form.control}
              name="firstName"
              onExtraChange={(e) => {
                dispatch(registerActions.setFirstName(e.target.value));
              }}
              type="text"
              label="First Name"
            />

            <TextField
              control={form.control}
              name="lastName"
              onExtraChange={(e) => {
                dispatch(registerActions.setLastName(e.target.value));
              }}
              type="text"
              label="Lirst Name"
            />
          </div>

          <div className="flex gap-4">
            <NumberField
              control={form.control}
              name="age"
              onExtraChange={(e) => {
                dispatch(registerActions.setAge(e.target.valueAsNumber));
              }}
              label="Age"
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="gender" className="text-xs -mb-2">
                    Gender
                  </FieldLabel>
                  <RadioGroup
                    id="gender"
                    className="flex gap-4 h-10 items-center"
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      dispatch(
                        registerActions.setGender(
                          value as "male" | "female" | "other"
                        )
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                      />
                      <Label
                        htmlFor="male"
                        className="text-xs text-gray-700 cursor-pointer"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                      />
                      <Label
                        htmlFor="female"
                        className="text-xs text-gray-700 cursor-pointer"
                      >
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="other"
                        id="other"
                        className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                      />
                      <Label
                        htmlFor="other"
                        className="text-xs text-gray-700 cursor-pointer"
                      >
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                  {fieldState.error && fieldState.isDirty && (
                    <p className="-m-2 text-xs pl-2 text-red-600">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex gap-4">
            <TextField
              control={form.control}
              name="city"
              onExtraChange={(e) => {
                dispatch(registerActions.setCity(e.target.value));
              }}
              type="text"
              label="City"
            />

            <TextField
              control={form.control}
              name="street"
              onExtraChange={(e) => {
                dispatch(registerActions.setStreet(e.target.value));
              }}
              type="text"
              label="Street"
            />
          </div>
          <div className="flex gap-4">
            <NumberField
              control={form.control}
              name="postalCode"
              onExtraChange={(e) => {
                dispatch(registerActions.setPostalCode(e.target.valueAsNumber));
              }}
              label="Postal Code"
            />
            <NumberField
              control={form.control}
              name="houseNumber"
              onExtraChange={(e) => {
                dispatch(
                  registerActions.setHouseNumber(e.target.valueAsNumber)
                );
              }}
              label="House Number"
            />
          </div>
          <TextAreaField
            control={form.control}
            name="extraDetails"
            placeholder="Tell us more about yourself (optional)"
            onExtraChange={(e) => {
              dispatch(registerActions.setExtraDetails(e.target.value));
            }}
            label="About you"
            defaultRows={4}
            maxAllowdChars={500}
          />
          <Controller
            name="avatar"
            control={form.control}
            render={({ field: { onChange, ref }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profileImage" className="text-xs -mb-2">
                  Profile Image
                </FieldLabel>
                <div className="w-full">
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    ref={ref}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFileName(file.name);
                        onChange(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="profileImage"
                    className="flex items-center justify-between w-full h-10 px-4 text-xs border border-black rounded-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {fileName ? (
                        <span className="text-black">{fileName}</span>
                      ) : (
                        <span className="text-gray-500">Choose an image</span>
                      )}
                    </span>
                    {fileName && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFileName(null);
                          onChange(undefined);
                          if (
                            ref &&
                            "current" in ref &&
                            ref.current &&
                            ref.current instanceof HTMLInputElement
                          ) {
                            ref.current.value = "";
                          }
                        }}
                        className="text-gray-600 hover:text-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </label>
                </div>
                {fieldState.error && fieldState.isDirty && (
                  <p className="-m-2 text-xs pl-2 text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />
          <SubmitButton formState={form.formState} type="submit">
            <>
              Next{" "}
              <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
            </>
          </SubmitButton>

          {}
        </div>
      </form>
    </Form>
  );
}

export default ProfileSep;
