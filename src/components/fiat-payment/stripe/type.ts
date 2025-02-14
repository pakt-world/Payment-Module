import type { OnrampAppearanceOptions, StripeOnramp } from "@stripe/crypto";
import { ReactNode } from "react";
import { BasicModalProps, IAny, onFinishResponseProps } from "types";

type CHAIN_TYPES = "avalanche";

interface StripeConfig {
  publicKey: string;
  theme?: "dark" | "light";
}

interface StripeModalProps extends BasicModalProps {
  chain: CHAIN_TYPES;
  onFinishResponse: (data:onFinishResponseProps)=> void;
  isLoading?:boolean;
}

interface StripeContextProps {
  // stripeOnramp:Promise<StripeOnramp | null>;
  publicKey:string;
  children: ReactNode;
}

interface OnRampProps {
  onramp: StripeOnramp | null 
}
interface OnRampElementProps extends Record<string, IAny> {
  clientSecret: string;
  appearance?: OnrampAppearanceOptions;
  isLoading?: boolean;
}

export {
  type StripeContextProps,
  type StripeModalProps,
  type OnRampProps,
  type OnRampElementProps,
  type StripeConfig,
}
