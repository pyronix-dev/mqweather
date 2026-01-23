"use client"

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
    clientSecret: string;
}

export function StripeCheckout({ clientSecret }: StripeCheckoutProps) {
    return (
        <div id="checkout" className="w-full">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <EmbeddedCheckout className="w-full" />
                </div>
            </EmbeddedCheckoutProvider>
        </div>
    )
}
