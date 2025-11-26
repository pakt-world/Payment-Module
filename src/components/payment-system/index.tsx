/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useConfig } from "../../context/config-context";
import { onResponseProps, PaymentData } from "../../types";
import CryptoPaymentExtended from "./crypto";

type PaymentView = "payment-method" | "crypto-payment" | "fiat-payment" | "";

interface PaymentSystemProps {
    isOpen: boolean;
    paymentData: PaymentData;
    currentView: PaymentView;
    onClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onPaymentSuccess?: (response: onResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
}

const PaymentSystem = ({
    isOpen,
    paymentData,
    currentView,
    onClose,
    onPaymentSuccess,
    enabledMethods = ["crypto"],
}: PaymentSystemProps) => {
    const config = useConfig();
    const isCryptoEnabled = enabledMethods.includes("crypto");

    if (!isOpen || !isCryptoEnabled) return null;

    return (
        <CryptoPaymentExtended
            isOpen={currentView === "crypto-payment"}
            config={config}
            amount={paymentData.amount}
            coin={paymentData.coin}
            description={paymentData.description}
            isSystemDeposit={paymentData.isSystemDeposit}
            chainId={paymentData.chainId}
            handlePaymentResponse={onPaymentSuccess || (() => {})}
            isLoading={false}
            closeModal={onClose}
        />
    );
};

export { PaymentSystem };
export type { PaymentSystemProps };

export type PaymentSystemRef = {
    // eslint-disable-next-line no-unused-vars
    startPayment: (data: PaymentData) => void;
    // eslint-disable-next-line no-unused-vars
    startCryptoPayment: (data: PaymentData) => void;
    // eslint-disable-next-line no-unused-vars
    startFiatPayment: (data: PaymentData) => void;
    close: () => void;
};

export type PaymentModuleProps = {
    config: any;
    // eslint-disable-next-line no-unused-vars
    onPaymentSuccess?: (response: any) => void;
    // eslint-disable-next-line no-unused-vars
    onPaymentError?: (response: any) => void;
};
