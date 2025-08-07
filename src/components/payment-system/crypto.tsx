import { useEffect, useState } from "react";
import { ConfigContextType, onFinishResponseProps } from "../../types";
import { usePaymentModule } from "../../hooks/use-payment-module";
import CryptoPayment from "../crypto-payment/cryptoPay";

const CryptoPaymentExtended = ({
    isOpen,
    config,
    amount,
    coin,
    description,
    isDirect,
    collectionType,
    owner,
    handlePaymentSuccess,
    handlePaymentError,
}: {
    isOpen: boolean;
    config: ConfigContextType;
    amount: number;
    coin: string;
    description: string;
    isDirect: boolean;
    collectionType: string;
    owner: string;
    handlePaymentSuccess: (response: onFinishResponseProps) => void;
    handlePaymentError: (response: onFinishResponseProps) => void;
}) => {
    const [isPreLoading, setIsPreLoading] = useState(true);
    const [collectionId, setCollectionId] = useState("");
    const [paymentData, setPaymentData] = useState<any>({});
    const { initiateCryptoPayment, validateCryptoPayment } = usePaymentModule();
    
    console.log("CryptoPaymentExtended", isOpen, config, amount, coin, isPreLoading, collectionId);
    
    const createCryptoPayment = async () => {
        try {
            console.log("createCryptoPayment", amount, coin, collectionId);
            const response = await initiateCryptoPayment({
                collectionType,
                amount,
                coin,
                description,
                owner,
                systemDeposit: isDirect,
                name: description,
            });
            console.log("createCryptoPayment response", response);
            if (response.status === "success") {
                setCollectionId(response.data.collectionId);
                setPaymentData(response.data);
                setIsPreLoading(false);
            } else {
                throw new Error(response.message);
            }  
        } catch (error: any) {
            console.log("createCryptoPayment error", error);
            handlePaymentError({
                status: "error",
                message: error.message,
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
        <CryptoPayment
            isOpen={isOpen}
            closeModal={closeModal}
            config={config}
            collectionId={paymentData.collectionId ?? ""}
            amount={paymentData.amountToPay}
            coin={paymentData.coin} // Default coin - this should be configurable
            depositAddress={paymentData.address ?? ""} // This should be provided from config
            chainId={Number(paymentData.chainId)} // Default to Avalanche - should be configurable
            contractAddress={paymentData.contractAddress ?? ""} // Should be provided from config
            tokenDecimal={6} // USDC decimals - should be configurable
            onSuccessResponse={handlePaymentSuccess}
            isLoading={false}
            isPreLoading={isPreLoading}
        />
    )
}

export default CryptoPaymentExtended;