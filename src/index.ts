//  Author: BeardKoda for Pakt (https://github.com/BeardKoda)
import "./styles/index.css";

export { PaktPaymentProvider } from "./components/payment-provider";
export { usePaktPayment } from "./context/payment-context";
export type { PaymentContextType } from "./context/payment-context";

export { default as PaktPaymentModule } from "./components";

export type {
    PaymentSystemRef,
    PaymentModuleProps,
} from "./components/payment-system";

export type { PaymentResponse } from "./lib/pakt-sdk";

export * as wagmi from "./components/wagmi";
export * from "./types";
