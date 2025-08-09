/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useEffect, useState } from "react";
import { ConfigContextType, onResponseProps } from "../../types";
import { usePaymentModule } from "../../hooks/use-payment-module";
import CryptoPayment from "../crypto-payment/cryptoPay";

interface CryptoPaymentExtendedProps {
    isOpen: boolean;
    config: ConfigContextType;
    amount: number;
    coin: string;
    description: string;
    isDirect: boolean;
    collectionType: string;
    owner: string;
    isLoading: boolean;
    handlePaymentResponse: (response: onResponseProps) => void; // eslint-disable-line no-unused-vars
}

const CryptoPaymentExtended = forwardRef<
    HTMLDivElement,
    CryptoPaymentExtendedProps
>(
    (
        {
            isOpen,
            config,
            amount,
            coin,
            description,
            isDirect,
            collectionType,
            owner,
            isLoading,
            handlePaymentResponse,
        },
        ref
    ) => {
        const [isPreLoading, setIsPreLoading] = useState(true);
        const [collectionId, setCollectionId] = useState("");
        const [paymentData, setPaymentData] = useState<any>({});
        const { initiateCryptoPayment } = usePaymentModule();

        const createCryptoPayment = async () => {
            try {
                const response = await initiateCryptoPayment({
                    collectionType,
                    amount,
                    coin,
                    description,
                    owner,
                    systemDeposit: isDirect,
                    name: description,
                });
                if (response.status === "success") {
                    setCollectionId(response.data.collectionId);
                    setPaymentData(response.data);
                    setIsPreLoading(false);
                } else {
                    throw new Error(response.message);
                }
            } catch (error: any) {
                handlePaymentResponse({
                    status: "error",
                    message: error.message,
                    txId: "",
                });
            }
        };

        const closeModal = () => {
            setIsPreLoading(false);
        };

        const handlePaymentPostResponse = async (response: onResponseProps) =>
            handlePaymentResponse({
                status: response.status,
                message: response.message,
                txId: response.txId,
                collectionId,
            });

        useEffect(() => {
            if (isOpen) {
                createCryptoPayment();
            }
        }, [isOpen]);

        return (
            <div ref={ref}>
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
                    onResponse={handlePaymentPostResponse}
                    isLoading={isLoading}
                    isPreLoading={isPreLoading}
                />
            </div>
        );
    }
);

CryptoPaymentExtended.displayName = "CryptoPaymentExtended";

export default CryptoPaymentExtended;
