/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { forwardRef, useImperativeHandle, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useConfig } from "../../context/config-context";
import { onFinishResponseProps } from "../../types";
import CryptoPaymentExtended from "./crypto";
import FiatPaymentExtended from "./fiat";

type PaymentView = 
    | "payment-method"
    | "crypto-payment" 
    | "fiat-payment"
    | "";

interface PaymentSystemProps {
    onPaymentSuccess?: (response: onFinishResponseProps) => void;
    onPaymentError?: (response: onFinishResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
}

interface PaymentData {
    amount: number;
    coin: string;
    description: string;
    isDirect: boolean;
    collectionType: string;
    owner: string;
    name: string;
}

type PaymentSystemRef = {
    startPayment: (data: PaymentData) => void;
    startCryptoPayment: (data: PaymentData) => void;
    startFiatPayment: (data: PaymentData) => void;
    close: () => void;
};

const PaymentSystem = forwardRef<PaymentSystemRef, PaymentSystemProps>(
    ({ 
        onPaymentSuccess, 
        onPaymentError,
        enabledMethods = ["crypto", "fiat"]
    }: PaymentSystemProps, ref) => {
        const [currentView, setCurrentView] = useState<PaymentView>("");
        const [isLoading, setIsLoading] = useState(false);
        const config = useConfig();
        const [paymentData, setPaymentData] = useState<PaymentData>({ amount: 0, coin: "", description: "", isDirect: false, collectionType: "", owner: "", name: "" });

        const resetCurrentView = () => {
            setCurrentView("");
            setIsLoading(false);
        };

        const handlePaymentSuccess = (response: onFinishResponseProps) => {
            onPaymentSuccess?.(response);
            resetCurrentView();
        };

        const handlePaymentError = (response: onFinishResponseProps) => {
            onPaymentError?.(response);
            setIsLoading(false);
        };

        // Determine which payment methods are available
        const isCryptoEnabled = enabledMethods.includes("crypto");
        const isFiatEnabled = enabledMethods.includes("fiat");
        const bothMethodsEnabled = isCryptoEnabled && isFiatEnabled;

        const startPaymentFlow = (data: PaymentData) => {
            setPaymentData(data);
            // If only one method is enabled, go directly to that method
            if (isCryptoEnabled && !isFiatEnabled) {
                setCurrentView("crypto-payment");
            } else if (isFiatEnabled && !isCryptoEnabled) {
                setCurrentView("fiat-payment");
            } else if (bothMethodsEnabled) {
                // Show method selection if both are enabled
                setCurrentView("payment-method");
            }
        };

        useImperativeHandle(ref, () => ({
            startPayment: (data: PaymentData) => {
                startPaymentFlow(data);
            },
            startCryptoPayment: (data: PaymentData) => {
                console.log("startCryptoPayment", data, isCryptoEnabled, currentView);
                setPaymentData(data);
                if (isCryptoEnabled) {
                    setCurrentView("crypto-payment");
                }
            },
            startFiatPayment: (data: PaymentData) => {
                setPaymentData(data);
                if (isFiatEnabled) {
                    setCurrentView("fiat-payment");
                }
            },
            close: () => {
                resetCurrentView();
            },
        }));

        return (
            <>
                {/* Payment Method Selection (when both methods are enabled) */}
                {bothMethodsEnabled && (
                    <div className={`pam:fixed pam:inset-0 pam:z-50 pam:flex pam:items-center pam:justify-center pam:bg-black pam:bg-opacity-50 ${currentView === "payment-method" ? "" : "pam:hidden"}`}>
                        <div className="pam:bg-white pam:rounded-lg pam:p-6 pam:max-w-md pam:w-full pam:mx-4">
                            <h2 className="pam:text-xl pam:font-semibold pam:mb-4">Choose Payment Method</h2>
                            <p className="pam:text-gray-600 pam:mb-6">
                                Amount: {paymentData.coin} {paymentData.amount}
                                {paymentData.description && <><br />Description: {paymentData.description}</>}
                            </p>
                            <div className="pam:space-y-3">
                                {isCryptoEnabled && (
                                    <button
                                        onClick={() => setCurrentView("crypto-payment")}
                                        className="pam:w-full pam:bg-blue-500 pam:text-white pam:py-3 pam:px-4 pam:rounded-lg pam:hover:bg-blue-600 pam:transition-colors"
                                        disabled={isLoading}
                                    >
                                        Pay with Cryptocurrency
                                    </button>
                                )}
                                {isFiatEnabled && (
                                    <button
                                        onClick={() => setCurrentView("fiat-payment")}
                                        className="pam:w-full pam:bg-green-500 pam:text-white pam:py-3 pam:px-4 pam:rounded-lg pam:hover:bg-green-600 pam:transition-colors"
                                        disabled={isLoading}
                                    >
                                        Pay with Card
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={resetCurrentView}
                                className="pam:w-full pam:mt-4 pam:bg-gray-300 pam:text-gray-700 pam:py-2 pam:px-4 pam:rounded-lg pam:hover:bg-gray-400 pam:transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Crypto Payment Modal */}
                {isCryptoEnabled && (
                    <CryptoPaymentExtended
                        isOpen={currentView === "crypto-payment"}
                        config={config}
                        amount={paymentData.amount}
                        coin={paymentData.coin}
                        description={paymentData.description}
                        isDirect={paymentData.isDirect}
                        collectionType={paymentData.collectionType}
                        owner={paymentData.owner}
                        handlePaymentSuccess={handlePaymentSuccess}
                        handlePaymentError={handlePaymentError}
                    />
                )}

                {/* Fiat Payment Modal */}
                {isFiatEnabled && (
                    <FiatPaymentExtended
                        isOpen={currentView === "fiat-payment"}
                        config={config}
                        amount={paymentData.amount}
                        handlePaymentSuccess={handlePaymentSuccess}
                        handlePaymentError={handlePaymentError}
                    />
                )}
            </>
        );
    }
);

export default PaymentSystem;
export { PaymentSystem };
export type { PaymentSystemProps, PaymentSystemRef };
