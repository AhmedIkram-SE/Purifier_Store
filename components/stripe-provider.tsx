"use client";

import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const options = clientSecret
    ? { clientSecret }
    : { mode: "payment" as const };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
