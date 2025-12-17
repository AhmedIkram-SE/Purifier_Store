"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Stripe as StripeType } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentFormProps {
  clientSecret: string;
  customerEmail: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentForm({
  clientSecret,
  customerEmail,
  onSuccess,
  onError,
  isLoading = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // First, submit the form to validate all fields
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(
          submitError.message || "Please fill in all required fields"
        );
        onError(submitError.message || "Form validation failed");
        setIsProcessing(false);
        return;
      }

      // Then confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        onError(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        // Payment successful
        onSuccess(paymentIntent.id);
      } else if (paymentIntent?.status === "processing") {
        setErrorMessage("Payment processing. Please wait...");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              email: customerEmail,
            },
          },
        }}
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || isProcessing || isLoading}
      >
        {isProcessing || isLoading ? "Processing..." : "Pay Now"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment information is secure and encrypted by Stripe.
      </p>
    </form>
  );
}
