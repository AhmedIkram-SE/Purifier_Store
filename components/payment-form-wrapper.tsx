"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/payment-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentFormWrapperProps {
  clientSecret: string;
  customerEmail: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentFormWrapper({
  clientSecret,
  customerEmail,
  onSuccess,
  onError,
  isLoading,
}: PaymentFormWrapperProps) {
  const options = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        clientSecret={clientSecret}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
        onError={onError}
        isLoading={isLoading}
      />
    </Elements>
  );
}
