//  Author: BeardKoda for Pakt (https://github.com/BeardKoda)
import "./styles/index.css";

// Main unified payment component (recommended)
export { default as PaktPaymentModule } from "./components";

export type { PaymentSystemRef, PaymentModuleProps } from "./components/payment-system";

// SDK types
export type { PaymentResponse } from "./lib/pakt-sdk";

// Utilities and types
export * as wagmi from "./components/wagmi";
export * from "./types";
