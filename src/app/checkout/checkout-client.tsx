'use client'

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { finalizeCheckoutPaymentAction, prepareCheckoutPaymentAction } from "./actions";
import { useCartStore } from "@/lib/store/cart";
import { getStripeClient } from "@/lib/stripe/client";

function StorefrontIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-4h16l1 4" /><path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" /><path d="M9 21V9" /></svg>; }
function DeliveryIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>; }
function DineInIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>; }
function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>; }
function ShieldIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>; }

const calendarDays = [12, 13, 14, 15, 16, 17, 18];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
const stripePromise = getStripeClient();

interface CheckoutClientProps {
  dynamicSlots: string[];
  userProfile?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
}

type PaymentFormProps = {
  localPaymentId: string;
  totalDisplay: string;
  disabled: boolean;
  onSuccess: () => void;
  onError: (message: string) => void;
};

function CheckoutPaymentForm({ localPaymentId, totalDisplay, disabled, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || disabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    onError("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        onError(result.error.message ?? "Payment confirmation failed.");
        return;
      }

      if (!result.paymentIntent) {
        onError("Stripe did not return a payment confirmation.");
        return;
      }

      const finalized = await finalizeCheckoutPaymentAction({
        localPaymentId,
        paymentIntentId: result.paymentIntent.id,
      });

      if (finalized.status === "failed") {
        onError("Payment failed. Please try another card or payment method.");
        return;
      }

      clearCart();
      onSuccess();

      if (finalized.status === "succeeded" || finalized.status === "processing") {
        router.push(`/order-confirmation?payment=${localPaymentId}`);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Unable to complete checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="submit"
        disabled={!stripe || !elements || disabled || isSubmitting}
        className="w-full amber-glow py-4 rounded-full flex items-center justify-center gap-3 text-on-primary font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-lg"
      >
        <LockIcon />
        {isSubmitting ? "Processing..." : `Pay ${totalDisplay}`}
      </button>
    </form>
  );
}

export default function CheckoutClient({ dynamicSlots, userProfile }: CheckoutClientProps) {
  const router = useRouter();
  const { items, promoCode, getTotals } = useCartStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);

  const [orderType, setOrderType] = useState<"pickup" | "delivery" | "dine_in">("pickup");
  const [pickupTime, setPickupTime] = useState<string>("ASAP");
  const [fullName, setFullName] = useState(userProfile?.full_name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [note, setNote] = useState("");
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [localPaymentId, setLocalPaymentId] = useState<string | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeItems = mounted ? items : [];
  const totals = mounted
    ? getTotals()
    : {
        subtotal: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
      };
  const timeSlots = dynamicSlots.length > 0 ? dynamicSlots : ["8:00am", "8:30am", "9:00am", "9:30am"];
  const totalDisplay = `$${totals.total.toFixed(2)}`;
  const canPreparePayment = mounted && safeItems.length > 0 && fullName.trim() !== "" && email.trim() !== "" && (orderType !== "delivery" || deliveryAddress.trim() !== "");

  const buildDetails = () => ({
    orderType,
    pickupTime,
    fullName,
    email,
    phone,
    note,
    deliveryAddress,
    savePaymentMethod,
  });

  const handleProceedToPayment = async () => {
    if (safeItems.length === 0) {
      setError("Your cart is empty.");
      setMessage("");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError("Please provide your name and email before continuing.");
      setMessage("");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      setError("Please provide a delivery address before continuing.");
      setMessage("");
      return;
    }

    setIsPreparingPayment(true);
    setError("");
    setMessage("");

    try {
      const prepared = await prepareCheckoutPaymentAction({
        details: buildDetails(),
        cart: {
          items: safeItems,
          promoCode,
          requestedDiscountAmount: totals.discount,
        },
        localPaymentId,
      });

      setLocalPaymentId(prepared.localPaymentId);
      setClientSecret(prepared.clientSecret);
      setMessage("Secure payment form is ready. Enter your card details below to complete checkout.");
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : "Unable to prepare payment.");
    } finally {
      setIsPreparingPayment(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="lg:w-[60%] space-y-10">
        <header>
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface mb-2">Checkout</h1>
          <p className="text-on-surface/50 font-body">Review your selection and confirm the details before payment.</p>
        </header>

        {message ? (
          <div className="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-500/10 text-red-300 p-4 rounded-xl border border-red-500/20">
            {error}
          </div>
        ) : null}

        <section className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
            <h2 className="font-headline text-2xl">Order Type</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <button type="button" onClick={() => setOrderType("pickup")} className={`cursor-pointer p-4 rounded-xl transition-all ${orderType === "pickup" ? "bg-surface-container-high ring-2 ring-primary text-primary" : "bg-surface-container-low hover:bg-surface-container-high text-on-surface/40"}`}>
              <div className="flex flex-col items-center text-center gap-2">
                <StorefrontIcon />
                <span className="font-medium text-sm">Pickup</span>
              </div>
            </button>
            <button type="button" onClick={() => setOrderType("delivery")} className={`cursor-pointer p-4 rounded-xl transition-all ${orderType === "delivery" ? "bg-surface-container-high ring-2 ring-primary text-primary" : "bg-surface-container-low hover:bg-surface-container-high text-on-surface/40"}`}>
              <div className="flex flex-col items-center text-center gap-2">
                <DeliveryIcon />
                <span className="font-medium text-sm">Delivery</span>
              </div>
            </button>
            <button type="button" onClick={() => setOrderType("dine_in")} className={`cursor-pointer p-4 rounded-xl transition-all ${orderType === "dine_in" ? "bg-surface-container-high ring-2 ring-primary text-primary" : "bg-surface-container-low hover:bg-surface-container-high text-on-surface/40"}`}>
              <div className="flex flex-col items-center text-center gap-2">
                <DineInIcon />
                <span className="font-medium text-sm">Dine In</span>
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
            <h2 className="font-headline text-2xl">Timing</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-surface-container rounded-2xl p-5 md:p-6">
            <div className="flex-shrink-0 w-full md:w-48 bg-surface-container-lowest rounded-xl p-4">
              <div className="text-xs font-bold text-primary uppercase mb-3 text-center font-label">Today</div>
              <div className="grid grid-cols-7 gap-1 text-[10px] text-on-surface/30 mb-2 font-mono text-center">
                {dayLabels.map((dayLabel, index) => <div key={`${dayLabel}-${index}`}>{dayLabel}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDays.map((day) => (
                  <div key={day} className={`p-1 rounded-full ${day === 14 ? "bg-primary text-deep-espresso font-bold" : day < 14 ? "text-on-surface/20" : "text-on-surface"}`}>{day}</div>
                ))}
              </div>
            </div>
            <div className="flex-grow">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button type="button" onClick={() => setPickupTime("ASAP")} className={`px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer transition-all ${pickupTime === "ASAP" ? "bg-primary text-deep-espresso ring-2 ring-primary" : "bg-surface-container-highest text-on-surface hover:bg-surface-bright"}`}>
                  ASAP
                </button>
                {timeSlots.map((slot) => (
                  <button type="button" key={slot} onClick={() => setPickupTime(slot)} className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${pickupTime === slot ? "bg-primary text-deep-espresso ring-2 ring-primary font-bold" : "bg-surface-container-highest text-on-surface hover:bg-surface-bright"}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
            <h2 className="font-headline text-2xl">Your Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="checkout-name" className="text-sm font-medium text-on-surface/50 font-body block">Full Name</label>
              <input id="checkout-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all" />
            </div>
            <div className="space-y-2">
              <label htmlFor="checkout-email" className="text-sm font-medium text-on-surface/50 font-body block">Email</label>
              <input id="checkout-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="checkout-phone" className="text-sm font-medium text-on-surface/50 font-body block">Phone Number</label>
              <input id="checkout-phone" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface/20 outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all" />
            </div>
            {orderType === "delivery" ? (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="checkout-address" className="text-sm font-medium text-on-surface/50 font-body block">Delivery Address</label>
                <textarea id="checkout-address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className="w-full min-h-28 px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface/20 outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all resize-none" placeholder="Street address, landmark, and any drop-off instructions" />
              </div>
            ) : null}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="checkout-note" className="text-sm font-medium text-on-surface/50 font-body block">Order Note (Optional)</label>
              <input id="checkout-note" type="text" placeholder="Extra napkins, specific instructions..." value={note} onChange={(e) => setNote(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface/20 outline-none font-body ring-1 ring-transparent focus:ring-primary/30 transition-all" />
            </div>
            <label className="md:col-span-2 flex items-start gap-3 rounded-xl bg-surface-container-high px-4 py-4 cursor-pointer">
              <input
                type="checkbox"
                checked={savePaymentMethod}
                onChange={(event) => setSavePaymentMethod(event.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-on-surface/70">
                Save this payment method for faster future orders.
              </span>
            </label>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
            <h2 className="font-headline text-2xl">Payment</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-xl bg-surface-container-high ring-2 ring-primary">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-deep-espresso rounded flex items-center justify-center text-blue-400 font-bold italic text-sm">VISA</div>
                <div>
                  <div className="text-sm font-bold">Stripe secure checkout</div>
                  <div className="text-xs text-on-surface/40">Powered by Payment Element</div>
                </div>
              </div>
              <LockIcon />
            </div>

            {!clientSecret ? (
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={!canPreparePayment || isPreparingPayment}
                className="w-full rounded-2xl bg-primary/10 text-primary px-4 py-4 font-bold hover:bg-primary/15 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPreparingPayment ? "Preparing secure payment form..." : "Load Secure Payment Form"}
              </button>
            ) : null}

            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#c8864a",
                      colorBackground: "#2b2119",
                      colorText: "#f5ede5",
                      colorDanger: "#f87171",
                      borderRadius: "16px",
                    },
                  },
                }}
              >
                <div className="space-y-5">
                  <div className="rounded-2xl bg-surface-container-highest p-4">
                    <PaymentElement options={{ layout: "tabs" }} />
                  </div>
                  {localPaymentId ? (
                    <CheckoutPaymentForm
                      localPaymentId={localPaymentId}
                      totalDisplay={totalDisplay}
                      disabled={safeItems.length === 0}
                      onSuccess={() => {
                        clearCart();
                      }}
                      onError={(paymentError) => setError(paymentError)}
                    />
                  ) : null}
                </div>
              </Elements>
            ) : null}
          </div>
          <p className="text-sm text-on-surface/40">
            Payment details are collected securely by Stripe and linked to your local order record after confirmation.
          </p>
        </section>
      </div>

      <div className="lg:w-[40%]">
        <div className="sticky top-24 bg-surface-container rounded-2xl p-6 md:p-8">
          <h3 className="font-headline text-2xl mb-8">Order Summary</h3>

          <div className="space-y-6 mb-8 max-h-64 overflow-y-auto">
            {safeItems.length === 0 ? <p className="text-on-surface/40 italic">{mounted ? "Cart is empty." : "Loading your cart..."}</p> : null}
            {safeItems.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest relative">
                  <Image src={item.imageUrl || "/images/coffee-cappuccino.png"} alt={item.productName} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{item.productName} <span className="text-on-surface/40 font-normal">x{item.quantity}</span></h4>
                    <span className="text-sm font-bold font-mono">${item.lineTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-on-surface/40 mt-1 line-clamp-2">
                    {Object.values(item.selectedOptions ?? {}).join(", ") || "Standard preparation"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 py-6 border-t border-b border-on-surface/10">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface/50">Subtotal</span>
              <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface/50">Delivery Fee</span>
              <span className="font-mono">$0.00</span>
            </div>
            {totals.discount > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface/50">Discount</span>
                <span className="font-mono text-primary">-${totals.discount.toFixed(2)}</span>
              </div>
            ) : null}
          </div>

          <div className="flex justify-between items-center py-6">
            <span className="font-headline text-xl">Total</span>
            <span className="font-headline text-3xl text-primary tracking-tight">{totalDisplay}</span>
          </div>

          <button
            type="button"
            onClick={clientSecret ? () => router.push("#payment") : handleProceedToPayment}
            disabled={!mounted || safeItems.length === 0 || isPreparingPayment}
            className="w-full amber-glow py-4 rounded-full flex items-center justify-center gap-3 text-on-primary font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-lg"
          >
            <LockIcon />
            {clientSecret ? "Payment Form Ready" : isPreparingPayment ? "Preparing..." : "Continue to Payment"}
          </button>

          <div className="flex items-center justify-center gap-2 mt-5">
            <ShieldIcon />
            <p className="text-[11px] text-on-surface/30 uppercase tracking-widest text-center font-label">
              Secure Stripe checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
