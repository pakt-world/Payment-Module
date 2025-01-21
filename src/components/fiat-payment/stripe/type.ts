import type { OnrampAppearanceOptions, StripeOnramp } from "@stripe/crypto";
import { ReactNode } from "react";
import { BasicModalProps, IAny } from "types";

type CHAIN_TYPES = "avalanche";

interface StripeModalProps extends BasicModalProps {
  publicKey: string;
  amount: number;
  chain: CHAIN_TYPES;
  coin: string;
  depositAddress: string; 
  secretKey: string;
}

interface StripeContextProps {
  stripeOnramp:Promise<StripeOnramp | null>;
  children: ReactNode;
}

interface OnRampProps {
  onramp: StripeOnramp | null 
}
interface OnRampElementProps extends Record<string, IAny> {
  clientSecret: string;
  appearance?: OnrampAppearanceOptions;
}

export {
  type StripeContextProps,
  type StripeModalProps,
  type OnRampProps,
  type OnRampElementProps,
}
