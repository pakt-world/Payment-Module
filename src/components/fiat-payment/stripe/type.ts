import type { OnrampAppearanceOptions, StripeOnramp } from "@stripe/crypto";
import { ReactNode } from "react";
import { IAny } from "types";

interface StripeModalProps {

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
