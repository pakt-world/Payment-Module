/* eslint-disable no-unused-vars */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { forwardRef, useImperativeHandle, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useConfig } from "../../context/config-context";
import { ConfigContextType, onResponseProps } from "../../types";
import CryptoPaymentExtended from "./crypto";
// import FiatPaymentExtended from "./fiat";
import { usePaymentModule } from "../../hooks/use-payment-module";
import Logger from "../../lib/logger";

type PaymentView = "payment-method" | "crypto-payment" | "fiat-payment" | "";

interface PaymentModuleProps {
    config: ConfigContextType;
    onPaymentSuccess?: (response: onResponseProps) => void;
    onPaymentError?: (response: onResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
}

interface PaymentSystemProps {
    onPaymentSuccess?: (response: onResponseProps) => void;
    onPaymentError?: (response: onResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
}

interface PaymentData {
    amount: number;
    coin: string;
    description: string;
    isSystemDeposit: boolean;
    chainId: string;
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
            enabledMethods = ["crypto"],
        }: PaymentSystemProps,
        ref
    ) => {
        const [currentView, setCurrentView] = useState<PaymentView>("");

        const config = useConfig();

        const [paymentData, setPaymentData] = useState<PaymentData>({
            amount: 0,
            coin: "",
            description: "",
            isSystemDeposit: false,
            chainId: "",
            name: "",
        });

        const { validateCryptoPayment } = usePaymentModule();

        const resetCurrentView = () => {
            setCurrentView("");
        };

        const handlePaymentSuccess = async (response: onResponseProps) => {
            if (response.status === "success" && response.collectionId) {
                // Perform async validation
                try {
                    const validateResponse = await validateCryptoPayment(
                        response?.collectionId ?? "",
                        response?.chainId ?? "",
                        10,
                        5000,
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
                Logger.error(`handlePaymentError ${JSON.stringify(response)}`);
            }
        };

        // Determine which payment methods are available
        const isCryptoEnabled = enabledMethods.includes("crypto");
        const isFiatEnabled = enabledMethods.includes("fiat");
        // const bothMethodsEnabled = isCryptoEnabled && isFiatEnabled;

        const startPaymentFlow = (data: PaymentData) => {
            setPaymentData(data);
            // If only one method is enabled, go directly to that method
            if (isCryptoEnabled && !isFiatEnabled) {
                setCurrentView("crypto-payment");
            } else if (isFiatEnabled && !isCryptoEnabled) {
                setCurrentView("fiat-payment");
            }
            setCurrentView("");
        };

        useImperativeHandle(ref, () => ({
            startPayment: (data: PaymentData) => {
                startPaymentFlow(data);
            },
            startCryptoPayment: (data: PaymentData) => {
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
                {/* Crypto Payment Modal */}
                {isCryptoEnabled && (
                    <CryptoPaymentExtended
                        isOpen={currentView === "crypto-payment"}
                        config={config}
                        amount={paymentData.amount}
                        coin={paymentData.coin}
                        description={paymentData.description}
                        isSystemDeposit={paymentData.isSystemDeposit}
                        chainId={paymentData.chainId}
                        handlePaymentResponse={handlePaymentSuccess}
                        isLoading={false}
                        closeModal={resetCurrentView}
                    />
                )}

                {/* Fiat Payment Modal */}
                {/* {isFiatEnabled && (
                    <FiatPaymentExtended
                        isOpen={currentView === "fiat-payment"}
                        config={config}
                        amount={paymentData.amount}
                        handlePaymentResponse={handlePaymentSuccess}
                        isLoading={false}
                    />
                )} */}
            </>
        );
    }
);

export { PaymentSystem };
export type { PaymentSystemRef, PaymentModuleProps };
