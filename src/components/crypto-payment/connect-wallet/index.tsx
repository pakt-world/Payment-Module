"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { IAny } from "types";
import type { ConnectorProps, CryptoPayWithWalletProps } from "../types";
import WalletConnectorList from "./wallet-connector-list";
import DepositCoin from "./deposit-coin";
import DepositToken from "./deposit-token";
import DisclaimerDialog from "../disclaimer-dialog";

const ConnectWallet = ({
    amount,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
    onResponse,
    isLoading,
    coin,
}: CryptoPayWithWalletProps) => {
    const {
        chain,
        isConnected,
        connector: activeConnector,
        status,
    } = useAccount();
    const {
        connect,
        connectors,
        isPending: isConnecting,
        // status: connectingStatus,
    } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const [selectedConnector, setSelectedConnector] = useState<
        ConnectorProps | undefined
    >(activeConnector || undefined);
    // const [showReconfirmButton, setShowReconfirmButton] = useState(false);
    const [disableButtonOnClick, setDisableButtonOnClick] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const amountToPay = useMemo(
        () => parseUnits(amount.toString(), tokenDecimal),
        [amount, tokenDecimal]
    );

    // Wrapper function to handle payment response and verification state
    const handlePaymentResponse = useCallback(
        (response: any) => {
            // Use setTimeout to defer the state updates to avoid render conflicts
            setTimeout(() => {
                if (response.status === "success") {
                    setIsVerifying(true);
                } else {
                    setIsVerifying(false);
                }

                // Call the original onResponse callback
                onResponse(response);
            }, 0);
        },
        [onResponse]
    );

    // Reset verification state when component unmounts or modal closes
    useEffect(() => {
        return () => {
            setIsVerifying(false);
        };
    }, []);

    // Reset verification state when a new payment session starts
    useEffect(() => {
        setIsVerifying(false);
    }, [depositAddress, contractAddress]);

    const isToken = !!contractAddress;
    const isWrongChain = chain?.id !== chainId;

    const ReadyConnectors = connectors
        .map((c: IAny) => ({ ...c, name: String(c.name) }))
        .filter(
            (connector, index, self) =>
                index === self.findIndex((c) => c.id === connector.id)
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    // switch network if wrong chain
    useEffect(() => {
        if (isWrongChain && switchChain != null) {
            console.log("switchChain", chainId);
            switchChain({ chainId });
        }
    }, [chainId, isConnected, isWrongChain]);

    // Handle button disable timeout state
    useEffect(() => {
        let timeoutId: number;
        if (disableButtonOnClick) {
            timeoutId = setTimeout(() => {
                setDisableButtonOnClick(false);
            }, 20000);
        }
        return () => clearTimeout(timeoutId);
    }, [disableButtonOnClick]);

    return (
        <div className="pam:flex pam:flex-col pam:gap-4">
            <p className="pam:text-center pam:text-sm pam:text-body-text">
                By making payment you acknowledge that you have read and
                understand the{" "}
                <button
                    className="pam:cursor-pointer pam:text-link-text"
                    type="button"
                    onClick={() => {
                        setShowDisclaimer(true);
                    }}
                >
                    terms of services.
                </button>
            </p>

            <div className="pam:flex pam:items-center pam:justify-between pam:gap-2 pam:rounded-2xl pam:border pam:border-border-color pam:bg-brand-secondary pam:px-4 pam:py-6 pam:text-brand-primary pam:max-sm:pam:h-[43px]">
                <span className="pam:text-lg pam:text-brand-primary">Total Amount:</span>
                <span className="pam:text-lg pam:font-bold">
                    {amount} {coin.toUpperCase()}
                </span>
            </div>

            <DisclaimerDialog
                isOpen={showDisclaimer}
                closeModal={() => {
                    setShowDisclaimer(false);
                }}
            />

            <WalletConnectorList
                activeConnector={activeConnector}
                selectedConnector={selectedConnector}
                setSelectedConnector={setSelectedConnector}
                isLoading={!!isLoading || isConnecting || disableButtonOnClick}
                connectors={ReadyConnectors}
                accountStatus={status}
            />

            {isToken ? (
                <DepositToken
                    chainId={chainId}
                    amountToPay={amountToPay}
                    contractAddress={contractAddress ?? ""}
                    depositAddress={depositAddress}
                    activeConnector={activeConnector}
                    selectedConnector={selectedConnector || activeConnector}
                    isDisabled={
                        !selectedConnector || isConnecting || !!isLoading
                    }
                    showReconfirmButton={false}
                    isLoading={isConnecting || !!isLoading}
                    disableButtonOnClick={disableButtonOnClick}
                    connect={connect}
                    onResponse={handlePaymentResponse}
                    disconnect={disconnect}
                    isVerifying={isVerifying}
                />
            ) : (
                <DepositCoin
                    isLoading={!!isLoading || isConnecting || !!isVerifying}
                    amount={amount}
                    depositAddress={depositAddress}
                    // chainId={chainId}
                    activeConnector={activeConnector}
                    selectedConnector={selectedConnector}
                    setDisableButtonOnClick={setDisableButtonOnClick}
                    connect={connect}
                    isDisabled={
                        !selectedConnector || isConnecting || !!isLoading
                    }
                    onResponse={handlePaymentResponse}
                    disconnect={disconnect}
                />
            )}
        </div>
    );
};

export default React.memo(ConnectWallet);
