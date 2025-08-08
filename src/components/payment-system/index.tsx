/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { forwardRef, useImperativeHandle, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "../common";
import { useConfig } from "../../context/config-context";
import { onFinishResponseProps } from "../../types";
import CryptoPaymentExtended from "./crypto";
import FiatPaymentExtended from "./fiat";
import { usePaymentModule } from "../../hooks/use-payment-module";

type PaymentView = "payment-method" | "crypto-payment" | "fiat-payment" | "";

interface PaymentSystemProps {
    onPaymentSuccess?: (response: onFinishResponseProps) => void;
    onPaymentError?: (response: onFinishResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
    isLoading?: boolean;
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
    (
        {
            onPaymentSuccess,
            onPaymentError,
            enabledMethods = ["crypto", "fiat"],
            isLoading = false,
        }: PaymentSystemProps,
        ref
    ) => {
        const [currentView, setCurrentView] = useState<PaymentView>("");

        const config = useConfig();
        const [paymentData, setPaymentData] = useState<PaymentData>({
            amount: 0,
            coin: "",
            description: "",
            isDirect: false,
            collectionType: "",
            owner: "",
            name: "",
        });
        const { validateCryptoPayment } = usePaymentModule();
        const resetCurrentView = () => {
            setCurrentView("");
        };

        const handlePaymentSuccess = async (
            response: onFinishResponseProps
        ) => {
            if (response.status === "success") {
                // Perform async validation
                try {
                    const validateResponse = await validateCryptoPayment(
                        response.collectionId
                    );
                    if (validateResponse.status === "success") {
                        onPaymentSuccess?.({
                            status: "success",
                            message: "Payment successful",
                            txId: response.txId,
                        });
                    } else {
                        onPaymentError?.({
                            status: "error",
                            message: validateResponse.message,
                            txId: response.txId,
                        });
                    }
                } catch (error: any) {
                    onPaymentError?.({
                        status: "error",
                        message: error.message,
                        txId: response.txId,
                    });
                } finally {
                    resetCurrentView();
                }
            } else {
                onPaymentError?.(response);
                console.log("handlePaymentError", response);
            }
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
                console.log(
                    "startCryptoPayment",
                    data,
                    isCryptoEnabled,
                    currentView
                );
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
                    <div
                        className={`pam:fixed pam:inset-0 pam:z-50 pam:flex pam:items-center pam:justify-center pam:bg-black pam:bg-opacity-50 ${currentView === "payment-method" ? "" : "pam:hidden"}`}
                    >
                        <div className="pam:bg-white pam:rounded-lg pam:p-6 pam:max-w-md pam:w-full pam:mx-4">
                            <h2 className="pam:text-xl pam:font-semibold pam:mb-4">
                                Choose Payment Method
                            </h2>
                            <p className="pam:text-gray-600 pam:mb-6">
                                Amount: {paymentData.coin} {paymentData.amount}
                                {paymentData.description && (
                                    <>
                                        <br />
                                        Description: {paymentData.description}
                                    </>
                                )}
                            </p>
                            <div className="pam:space-y-3">
                                {isCryptoEnabled && (
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            setCurrentView("crypto-payment")
                                        }
                                        disabled={isLoading}
                                    >
                                        Pay with Cryptocurrency
                                    </Button>
                                )}
                                {isFiatEnabled && (
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            setCurrentView("fiat-payment")
                                        }
                                        disabled={isLoading}
                                    >
                                        Pay with Card
                                    </Button>
                                )}
                            </div>
                            <Button
                                variant="secondary"
                                onClick={resetCurrentView}
                            >
                                Cancel
                            </Button>
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
                        handlePaymentResponse={handlePaymentSuccess}
                        isLoading={isLoading}
                    />
                )}

                {/* Fiat Payment Modal */}
                {isFiatEnabled && (
                    <FiatPaymentExtended
                        isOpen={currentView === "fiat-payment"}
                        config={config}
                        amount={paymentData.amount}
                        handlePaymentResponse={handlePaymentSuccess}
                        isLoading={isLoading}
                    />
                )}
            </>
        );
    }
);

export default PaymentSystem;
export { PaymentSystem };
export type { PaymentSystemProps, PaymentSystemRef };
