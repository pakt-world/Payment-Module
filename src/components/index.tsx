/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "../context/config-context";
import {
    PaymentSystem,
    PaymentSystemProps,
    PaymentSystemRef,
} from "./payment-system";
import "../styles/index.css";
import { ConfigContextType, PaymentData } from "../types";

const PaktPaymentModule = forwardRef(
    (
        {
            config,
            onPaymentSuccess,
            onPaymentError,
            isLoading,
        }: PaymentSystemProps & { config: ConfigContextType },
        ref: Ref<PaymentSystemRef>
    ) => {
        const paymentModuleRef = useRef<PaymentSystemRef>(null);

        useImperativeHandle(ref, () => ({
            startPayment: (data: PaymentData) => {
                paymentModuleRef.current?.startPayment(data);
            },
            startCryptoPayment: (data: PaymentData) => {
                paymentModuleRef.current?.startCryptoPayment(data);
            },
            startFiatPayment: (data: PaymentData) => {
                paymentModuleRef.current?.startFiatPayment(data);
            },
            close: () => {
                paymentModuleRef.current?.close();
            },
        }));

        return (
            <div className="pakt-payment-module">
                <ConfigProvider config={config}>
                    <PaymentSystem
                        ref={paymentModuleRef}
                        onPaymentSuccess={onPaymentSuccess}
                        onPaymentError={onPaymentError}
                        isLoading={isLoading || false}
                    />
                </ConfigProvider>
            </div>
        );
    }
);

PaktPaymentModule.displayName = "PaktPaymentModule";

export default PaktPaymentModule;
