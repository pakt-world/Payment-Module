/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { forwardRef, Ref, useImperativeHandle, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "../context/config-context";
import { PaymentSystem, PaymentSystemRef } from "./payment-system";
import { PaymentModuleProps } from "./types";
import "../styles/index.css";
import { PaymentData } from "../types";

export { PaktPaymentProvider } from "./payment-provider";

const PaktPaymentModule = forwardRef(
    (
        { config, onPaymentSuccess }: PaymentModuleProps,
        ref: Ref<PaymentSystemRef>
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [currentView, setCurrentView] = useState<
            "crypto-payment" | "fiat-payment" | ""
        >("");
        const [paymentData, setPaymentData] = useState<PaymentData>({
            amount: 0,
            coin: "",
            description: "",
            isSystemDeposit: false,
            chainId: "",
            name: "",
        });

        useImperativeHandle(ref, () => ({
            startPayment: (data: PaymentData) => {
                setPaymentData(data);
                setCurrentView("crypto-payment");
                setIsOpen(true);
            },
            startCryptoPayment: (data: PaymentData) => {
                setPaymentData(data);
                setCurrentView("crypto-payment");
                setIsOpen(true);
            },
            startFiatPayment: (data: PaymentData) => {
                setPaymentData(data);
                setCurrentView("fiat-payment");
                setIsOpen(true);
            },
            close: () => {
                setIsOpen(false);
                setCurrentView("");
            },
        }));

        return (
            <div className="pakt-payment-module">
                <ConfigProvider config={config}>
                    <PaymentSystem
                        isOpen={isOpen}
                        paymentData={paymentData}
                        currentView={currentView}
                        onClose={() => {
                            setIsOpen(false);
                            setCurrentView("");
                        }}
                        onPaymentSuccess={onPaymentSuccess}
                    />
                </ConfigProvider>
            </div>
        );
    }
);

PaktPaymentModule.displayName = "PaktPaymentModule";

export default PaktPaymentModule;
