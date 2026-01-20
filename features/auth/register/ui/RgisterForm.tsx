"use client";
import "react-phone-input-2/lib/style.css";
import ProfileSep from "./steps/ProfileSep";
import CredentialStep from "./steps/CredentialStep";
import VerificationStep from "./steps/VerificationStep";
import CompletedStep from "./steps/CompletedStep";
import { useAppDispatch, useAppSelector } from "@/store";
import { FormSteps } from "../../types";
import { selectRegisterStep } from "../selector";
import { useEffect } from "react";
import { registerActions } from "../slice";

function RegisterForm() {
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectRegisterStep);

  useEffect(() => {
    return () => {
      dispatch(registerActions.setStep(FormSteps.CREDENTIALS));
    };
  }, [dispatch]);

  return (
    <>
      {step === FormSteps.CREDENTIALS && <CredentialStep />}
      {step === FormSteps.PROFILE && <ProfileSep />}
      {step === FormSteps.VERIFICATION && <VerificationStep />}
      {step === FormSteps.COMPLETED && <CompletedStep />}
    </>
  );
}

export default RegisterForm;
