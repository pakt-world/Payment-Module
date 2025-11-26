/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useCallback, useMemo, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "../context/config-context";
import { PaymentContext, PaymentContextType } from "../context/payment-context";
import { usePaymentModule } from "../hooks/use-payment-module";
import { PaymentSystem } from "./payment-system";
import { ConfigContextType, onResponseProps, PaymentData } from "../types";

interface PaktPaymentProviderProps {
    config: ConfigContextType;
    children: ReactNode;
    // eslint-disable-next-line no-unused-vars
    onPaymentSuccess?: (response: onResponseProps) => void;
    // eslint-disable-next-line no-unused-vars
    onPaymentError?: (response: onResponseProps) => void;
    enabledMethods?: ("crypto" | "fiat")[];
}

type PaymentView = "payment-method" | "crypto-payment" | "fiat-payment" | "";

export const PaktPaymentProvider = ({
    config,
    children,
    onPaymentSuccess,
    onPaymentError,
    enabledMethods = ["crypto"],
}: PaktPaymentProviderProps) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<PaymentView>("");
    const [paymentData, setPaymentData] = useState<PaymentData>({
        amount: 0,
        coin: "",
        description: "",
        isSystemDeposit: false,
        chainId: "",
        name: "",
    });

    const paymentHook = usePaymentModule();

    const isCryptoEnabled = enabledMethods.includes("crypto");
    const isFiatEnabled = enabledMethods.includes("fiat");

    const closePayment = useCallback(() => {
        setIsPaymentModalOpen(false);
        setCurrentView("");
    }, []);

    const handlePaymentSuccess = useCallback(
        async (response: onResponseProps) => {
            if (response.status === "success" && response.collectionId) {
                try {
                    const validateResponse =
                        await paymentHook.validateCryptoPayment(
                            response?.collectionId ?? "",
                            response?.chainId ?? "",
                            10,
                            5000
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
                    closePayment();
                }
            } else {
                onPaymentError?.(response);
            }
        },
        [paymentHook, onPaymentSuccess, onPaymentError, closePayment]
    );

    const startPayment = useCallback(
        (data: PaymentData) => {
            setPaymentData(data);
            if (isCryptoEnabled && !isFiatEnabled) {
                setCurrentView("crypto-payment");
                setIsPaymentModalOpen(true);
            } else if (isFiatEnabled && !isCryptoEnabled) {
                setCurrentView("fiat-payment");
                setIsPaymentModalOpen(true);
            }
        },
        [isCryptoEnabled, isFiatEnabled]
    );

    const startCryptoPayment = useCallback(
        (data: PaymentData) => {
            setPaymentData(data);
            if (isCryptoEnabled) {
                setCurrentView("crypto-payment");
                setIsPaymentModalOpen(true);
            }
        },
        [isCryptoEnabled]
    );

    const startFiatPayment = useCallback(
        (data: PaymentData) => {
            setPaymentData(data);
            if (isFiatEnabled) {
                setCurrentView("fiat-payment");
                setIsPaymentModalOpen(true);
            }
        },
        [isFiatEnabled]
    );

    const contextValue: PaymentContextType = useMemo(
        () => ({
            payment: paymentHook.payment,
            loading: paymentHook.loading,
            error: paymentHook.error,
            initiateCryptoPayment: paymentHook.initiateCryptoPayment,
            validateCryptoPayment: paymentHook.validateCryptoPayment,
            clearError: paymentHook.clearError,
            clearPayment: paymentHook.clearPayment,
            isPaymentModalOpen,
            currentPaymentData: paymentData,
            startPayment,
            startCryptoPayment,
            startFiatPayment,
            close: closePayment,
        }),
        [
            paymentHook.payment,
            paymentHook.loading,
            paymentHook.error,
            paymentHook.initiateCryptoPayment,
            paymentHook.validateCryptoPayment,
            paymentHook.clearError,
            paymentHook.clearPayment,
            isPaymentModalOpen,
            paymentData,
            startPayment,
            startCryptoPayment,
            startFiatPayment,
            closePayment,
        ]
    );

    return (
        <ConfigProvider config={config}>
            <PaymentContext.Provider value={contextValue}>
                {children}
                {isPaymentModalOpen && (
                    <PaymentSystem
                        isOpen={isPaymentModalOpen}
                        paymentData={paymentData}
                        currentView={currentView}
                        onClose={closePayment}
                        onPaymentSuccess={handlePaymentSuccess}
                        enabledMethods={enabledMethods}
                    />
                )}
            </PaymentContext.Provider>
        </ConfigProvider>
    );
};
