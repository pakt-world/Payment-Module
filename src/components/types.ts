import { ConfigContextType } from "types";

type PaymentModuleRef = {
    onPayment: () => void;
};

interface PaymentModuleProps {
    config: ConfigContextType;
    onPaymentSuccess?: (response: any) => void;
    onPaymentError?: (response: any) => void;
}

interface DesktopPaymentModuleProps {
    onPaymentSuccess?: (userData: any) => void;
    onPaymentError?: (userData: any) => void;
}



export type { PaymentModuleProps, DesktopPaymentModuleProps, PaymentModuleRef };