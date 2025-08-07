/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CryptoPaymentModalProps } from "./types";
import { ConfigProvider } from "../../context/config-context";
import CryptoPayment from "./cryptoPay";

const CryptoPaymentModal = ({
    config,
    isOpen,
    closeModal,
    amount,
    coin,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
    onSuccessResponse,
    isLoading,
    collectionId,
    isPreLoading = true
}: CryptoPaymentModalProps): ReactElement => {
    return (
        <ConfigProvider config={config}>
            <CryptoPayment 
                isOpen={isOpen}
                closeModal={closeModal}
                amount={amount}
                coin={coin}
                depositAddress={depositAddress}
                contractAddress={contractAddress}
                chainId={chainId}
                tokenDecimal={tokenDecimal}
                collectionId={collectionId}
                onSuccessResponse={onSuccessResponse}
                isLoading={isLoading}
                config={config}
                isPreLoading={isPreLoading}
            />
        </ConfigProvider>
    );
};

export { CryptoPaymentModal };
