import type { OnrampAppearanceOptions, StripeOnramp } from "@stripe/crypto";
import { ReactNode } from "react";
import { BasicModalProps, IAny, onFinishResponseProps, ConfigContextType } from "../../../types";

type CHAIN_TYPES = "avalanche";

interface StripeConfig {
  publicKey: string;
  clientSecret: string;
  theme?: "dark" | "light";
}

interface StripeModalProps extends BasicModalProps {
  config: ConfigContextType;
  chain: CHAIN_TYPES;
  onFinishResponse: (data:onFinishResponseProps)=> void;
  isLoading?:boolean;
  isPreLoading?:boolean;
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
  config: ConfigContextType;
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
