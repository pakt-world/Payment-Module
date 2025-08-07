import { useEffect, useState } from "react";
import StripePayment from "../fiat-payment/stripe";
import { ConfigContextType, onFinishResponseProps } from "../../types";
import { usePaymentModule } from "../../hooks/use-payment-module";

const FiatPaymentExtended = ({
    isOpen,
    config,
    amount,
    handlePaymentSuccess,
    handlePaymentError,
}: {
    isOpen: boolean;
    config: ConfigContextType;
    amount: number;
    handlePaymentSuccess: (response: onFinishResponseProps) => void;
    handlePaymentError: (response: onFinishResponseProps) => void;
}) => {
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
            handlePaymentError({
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
        <StripePayment
            isOpen={isOpen}
            closeModal={closeModal}
            config={config}
            collectionId={collectionId}
            chain="avalanche"
            onFinishResponse={handlePaymentSuccess}
            isLoading={false}
            isPreLoading={isPreLoading}
        />
    )
}

export default FiatPaymentExtended;