"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { ReactNode, useMemo } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

const StripeProvider = ({ clientSecret, children }: StripeProviderProps) => {
  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#0F172A",
          colorBackground: "#ffffff",
          colorText: "#1e293b",
          colorDanger: "#ef4444",
          fontFamily: "Inter, system-ui, sans-serif",
          spacingUnit: "4px",
          borderRadius: "8px",
        },
      },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
