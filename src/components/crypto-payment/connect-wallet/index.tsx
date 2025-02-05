"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Logger from "lib/logger";
import type { IAny } from 'types';
import type { ConnectorProps, CryptoPayWithWalletProps } from "../types";
import { WalletConnectorList } from "./wallet-connector-list";
import { DepositAvax } from "./deposit-coin";
import DepositToken from "./deposit-token";
import { DisclaimerDialog } from "../disclaimer-dialog";


export const ConnectWallet = ({
    amount,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
    onSuccessResponse,
    isLoading
}: CryptoPayWithWalletProps): JSX.Element => {
    const {
        chain,
        isConnected,
        connector: activeConnector,
        status,
    } = useAccount();
    const { connect, connectors, isPending:isConnecting } = useConnect();
    const { switchChain } = useSwitchChain();
    const [selectedConnector, setSelectedConnector] = useState<
        ConnectorProps | undefined
    >(activeConnector || undefined);
    const [showReconfirmButton, setShowReconfirmButton] = useState(false);
    const [disableButtonOnClick, setDisableButtonOnClick] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const amountToPay = useMemo(
        () => parseUnits(amount.toString(), tokenDecimal),
        [amount, tokenDecimal]
    );

    const isToken = !!contractAddress;
    const isWrongChain = chain?.id !== chainId;

    const ReadyConnectors = connectors
        .map((c: IAny) => ({ ...c, name: String(c.name) }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    // switch network if wrong chain
    useEffect(() => {
        if (isWrongChain && switchChain != null) {
            switchChain({ chainId });
        }
    }, [chainId, isConnected, isWrongChain, switchChain]);

    // Handle button disable timeout state
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (disableButtonOnClick) {
            timeoutId = setTimeout(() => {
                setDisableButtonOnClick(false);
            }, 20000);
        }
        return () => clearTimeout(timeoutId);
    }, [disableButtonOnClick]);

    Logger.info("Account Status ===>>>", { status, isLoading, isConnecting, disableButtonOnClick });
    Logger.info("Selected Connector ===>>>", { selectedConnector, isToken, contractAddress, amount, tokenDecimal });

    return (
        <div className="pam-flex pam-flex-col pam-gap-8">
            <p className="pam-text-center pam-text-sm pam-text-body">
                By making payment you acknowledge that you have read and
                understand the
                <button
                    className="pam-cursor-pointer pam-text-[#3772FF]"
                    rel="noreferrer"
                    onClick={() => {
                    	setShowDisclaimer(true);
                    }}
                >
                    terms of services
                </button>
                and
                <button
                    className="pam-cursor-pointer pam-text-[#3772FF]"
                    rel="noreferrer"
                    onClick={() => {
                    	setShowDisclaimer(true);
                    }}
                >
                    privacy policy
                </button>
            </p>
            
            <DisclaimerDialog
              isOpen={showDisclaimer}
              closeModal={() => {
                setShowDisclaimer(false);
              }}
            />

            <WalletConnectorList
              activeConnector={selectedConnector}
              selectedConnector={selectedConnector}
              setSelectedConnector={setSelectedConnector}
              isLoading={!!isLoading || isConnecting}
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
                  selectedConnector={selectedConnector}
                  isDisabled={!selectedConnector || isConnecting || !!isLoading}
                  showReconfirmButton={showReconfirmButton}
                  isLoading={isConnecting || !!isLoading}
                  disableButtonOnClick={disableButtonOnClick}
                  connect={connect}
                  onSuccessResponse={onSuccessResponse}
                />
            ) : (
                <DepositAvax
                  isLoading={!!isLoading || isConnecting}
                  amount={amount}
                  depositAddress={depositAddress}
                  chainId={chainId}
                  activeConnector={activeConnector}
                  selectedConnector={selectedConnector}
                  setDisableButtonOnClick={setDisableButtonOnClick}
                  connect={connect}
                  isDisabled={!selectedConnector || isConnecting || !!isLoading}
                  onSuccessResponse={onSuccessResponse}
                />
            )}
        </div>
    );
};
