//  Author: BeardKoda for Pakt (https://github.com/BeardKoda)

import "./styles/index.css";

// Main unified payment component (recommended)
export { default as PaktPaymentModule } from "./components";

// Individual payment components (legacy)
export * from "./components/fiat-payment";
export * from "./components/crypto-payment";
export * from "./components/payment-system";

// Hooks
export { usePaymentModule } from "./hooks/use-payment-module";

// Utilities and types
export * from "./components/wagmi";
export * from "./types";
