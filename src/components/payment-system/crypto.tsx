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
    isSystemDeposit: boolean;
    chainId: string;
    isLoading: boolean;
    handlePaymentResponse: (response: onResponseProps) => void; // eslint-disable-line no-unused-vars
    closeModal: () => void;
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
            chainId,
            description,
            isSystemDeposit,
            handlePaymentResponse,
            closeModal: closeModalFromParent,
        },
        ref
    ) => {
        const [isPreLoading, setIsPreLoading] = useState(true);
        const [collectionId, setCollectionId] = useState("");
        const [paymentData, setPaymentData] = useState<any>({});
        const { initiateCryptoPayment, loading } = usePaymentModule();

        const createCryptoPayment = async () => {
            try {
                const response = await initiateCryptoPayment({
                    amount,
                    coin,
                    description,
                    systemDeposit: isSystemDeposit,
                    name: description,
                    chainId,
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

        const handlePaymentPostResponse = async (response: onResponseProps) =>
            handlePaymentResponse({
                status: response.status,
                message: response.message,
                txId: response.txId,
                collectionId,
                chainId: paymentData?.chainId,
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
                    closeModal={closeModalFromParent}
                    config={config}
                    collectionId={paymentData.collectionId ?? ""}
                    amount={paymentData.amountToPay}
                    coin={paymentData.coin} // Default coin - this should be configurable
                    depositAddress={paymentData.address ?? ""} // This should be provided from config
                    chainId={Number(paymentData.chainId)} // Default to Avalanche - should be configurable
                    contractAddress={paymentData.contractAddress ?? ""} // Should be provided from config
                    tokenDecimal={6} // USDC decimals - should be configurable
                    onResponse={handlePaymentPostResponse}
                    isLoading={loading}
                    isPreLoading={isPreLoading}
                />
            </div>
        );
    }
);

CryptoPaymentExtended.displayName = "CryptoPaymentExtended";

export default CryptoPaymentExtended;
