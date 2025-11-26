/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { createContext, useContext } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PaymentData } from "../types";
import { UsePaymentModuleReturn } from "../hooks/use-payment-module";

export interface PaymentContextType extends UsePaymentModuleReturn {
    isPaymentModalOpen: boolean;
    currentPaymentData: PaymentData | null;
    // eslint-disable-next-line no-unused-vars
    startPayment: (data: PaymentData) => void;
    // eslint-disable-next-line no-unused-vars
    startCryptoPayment: (data: PaymentData) => void;
    // eslint-disable-next-line no-unused-vars
    startFiatPayment: (data: PaymentData) => void;
    close: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const usePaymentContext = (): PaymentContextType => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error(
            "usePaymentContext must be used within a PaktPaymentProvider"
        );
    }
    return context;
};

export const usePaktPayment = (): PaymentContextType => {
    return usePaymentContext();
};

export { PaymentContext };
