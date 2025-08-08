import { useEffect, useState, forwardRef } from "react";
import StripePayment from "../fiat-payment/stripe";
import { ConfigContextType, onFinishResponseProps } from "../../types";
import { usePaymentModule } from "../../hooks/use-payment-module";

interface FiatPaymentExtendedProps {
    isOpen: boolean;
    config: ConfigContextType;
    amount: number;
    isLoading: boolean;
    handlePaymentResponse: (response: onFinishResponseProps) => void;
}

const FiatPaymentExtended = forwardRef<HTMLDivElement, FiatPaymentExtendedProps>(({
    isOpen,
    config,
    amount,
    isLoading,
    handlePaymentResponse,
}, ref) => {
    const [isPreLoading, setIsPreLoading] = useState(true);
    const [collectionId, setCollectionId] = useState("");
    const { initiateCryptoPayment } = usePaymentModule();
    const coin = "usdc";

    const createCryptoPayment = async () => {
        const response = await initiateCryptoPayment({
            amount,
            coin,
            collectionId,
        });
        if (response.status === "success") {
            setCollectionId(response.data.collectionId);
        } else {
            handlePaymentResponse({
                status: "error",
                message: response.message,
                txId: "",
            });
        }
    }

    const closeModal = () => {
        setIsPreLoading(false);
    }

    useEffect(() => {
        if (isOpen) {
            createCryptoPayment();
        }
    }, [isOpen]);

    return (
        <div ref={ref}>
            <StripePayment
                isOpen={isOpen}
                closeModal={closeModal}
                config={config}
                collectionId={collectionId}
                chain="avalanche"
                onFinishResponse={handlePaymentResponse}
                isLoading={isLoading}
                isPreLoading={isPreLoading}
            />
        </div>
    )
});

FiatPaymentExtended.displayName = 'FiatPaymentExtended';

export default FiatPaymentExtended;