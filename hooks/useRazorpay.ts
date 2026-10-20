"use client";

import { useCallback, useEffect, useState } from "react";
import { createPaymentOrder, verifyPayment } from "@/services/paymentService";

// Razorpay global type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/** Loads the Razorpay checkout.js script once and returns ready state */
function useRazorpayScript(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) { setReady(true); return; }

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  return ready;
}

// ── Public hook ────────────────────────────────────────────────────────────

export interface RazorpayOptions {
  planId: number;
  planName: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  onSuccess: (paymentId: string) => void;
  onError: (msg: string) => void;
}

export function useRazorpay() {
  const scriptReady = useRazorpayScript();
  const [loading, setLoading] = useState(false);

  const openCheckout = useCallback(
    async ({
      planId,
      planName,
      userName,
      userEmail,
      userPhone,
      onSuccess,
      onError,
    }: RazorpayOptions) => {
      if (!scriptReady) {
        onError("Payment SDK is not ready. Please try again.");
        return;
      }

      setLoading(true);
      try {
        // Step 1 — create backend order
        const order = await createPaymentOrder(planId);

        // Step 2 — open Razorpay checkout modal
        const options = {
          key: order.razorpayKeyId,
          amount: Math.round(order.amount * 100), // order.amount is GST-inclusive INR → convert to paise
          currency: order.currency || "INR",
          name: "Made2Match Matrimony",
          description: planName,
          order_id: order.razorpayOrderId,
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone || "",
          },
          theme: { color: "#c0174c" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              onError("Payment cancelled.");
            },
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 3 — verify payment on backend
              await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              onSuccess(response.razorpay_payment_id);
            } catch (err: any) {
              onError(
                err?.response?.data?.message ||
                  "Payment verification failed. Contact support."
              );
            } finally {
              setLoading(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp: any) => {
          setLoading(false);
          onError(resp?.error?.description || "Payment failed. Please try again.");
        });
        rzp.open();
      } catch (err: any) {
        setLoading(false);
        onError(
          err?.response?.data?.message ||
            "Could not initiate payment. Please try again."
        );
      }
    },
    [scriptReady]
  );

  return { openCheckout, loading, scriptReady };
}
