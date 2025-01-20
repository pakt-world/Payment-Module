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
import type { ConnectorProps, CryptoPayWithWalletProps, IAny } from "types";
import { WalletConnectorList } from "./wallet-connector-list";
import { DepositAvax } from "./deposit-coin";
import { DepositUSDC } from "./deposit-token";
// import { DisclaimerDialog } from "@/components/dialogs/make-deposit/disclaimer";

export const ConnectWallet = ({
    amount,
    depositAddress,
    closeModel,
    contractAddress,
    chainId,
    tokenDecimal,
}: CryptoPayWithWalletProps): JSX.Element => {
    const {
        chain,
        isConnected,
        connector: activeConnector,
        status,
    } = useAccount();
    const { connect, connectors, isLoading } = useConnect();
    const { switchChain } = useSwitchChain();
    const [selectedConnector, setSelectedConnector] = useState<
        ConnectorProps | undefined
    >(activeConnector || undefined);
    const [showReconfirmButton, setShowReconfirmButton] = useState(false);
    const [disableButtonOnClick, setDisableButtonOnClick] = useState(false);
    // const [showDisclaimer, setShowDisclaimer] = useState(false);

    const amountToPay = useMemo(
        () => parseUnits(amount.toString(), tokenDecimal),
        [amount, tokenDecimal]
    );

    const isToken = !contractAddress;
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

    Logger.info("Account Status ===>>>", { status });
    Logger.info("Selected Connector ===>>>", { selectedConnector });

    return (
        <div className="flex flex-col gap-8">
            <p className="text-center text-sm text-body">
                By making payment you acknowledge that you have read and
                understand the{" "}
                <a
                    href="https://docs.google.com/document/d/1HLzHT3NHG6dm6497IZcnMlgUj0wnhaPwgiW8U0MfewM/edit?tab=t.0"
                    target="_blank"
                    className="cursor-pointer text-[#3772FF]"
                    rel="noreferrer"
                    // onClick={() => {
                    // 	setShowDisclaimer(true);
                    // }}
                >
                    terms of services
                </a>{" "}
                and{" "}
                <a
                    href="https://docs.google.com/document/d/1WoNGi2Wx841eDJxf2lHX-KpvDw06DkYJdpTXMuP0Fa0/edit?tab=t.0"
                    target="_blank"
                    className="cursor-pointer text-[#3772FF]"
                    rel="noreferrer"
                    // onClick={() => {
                    // 	setShowDisclaimer(true);
                    // }}
                >
                    privacy policy
                </a>
            </p>
            {/* <DisclaimerDialog
				isOpen={showDisclaimer}
				closeModal={() => {
					setShowDisclaimer(false);
				}}
			/> */}
            <WalletConnectorList
                activeConnector={selectedConnector}
                selectedConnector={selectedConnector}
                setSelectedConnector={setSelectedConnector}
                isLoading={isLoading}
                connectors={ReadyConnectors}
                accountStatus={status}
            />

            {isToken ? (
                <DepositUSDC
                    chainId={chainId}
                    amountToPay={amountToPay}
                    contractAddress={contractAddress ?? ""}
                    depositAddress={depositAddress}
                    activeConnector={activeConnector}
                    selectedConnector={selectedConnector}
                    isDisabled={!selectedConnector || isLoading}
                    showReconfirmButton={showReconfirmButton}
                    isLoading={isLoading}
                    setShowReconfirmButton={setShowReconfirmButton}
                    closeModel={closeModel}
                    disableButtonOnClick={disableButtonOnClick}
                    setDisableButtonOnClick={setDisableButtonOnClick}
                    connect={connect}
                />
            ) : (
                <DepositAvax
                    isLoading={isLoading || !selectedConnector}
                    amount={amount}
                    depositAddress={depositAddress}
                    closeModel={closeModel}
                    chainId={chainId}
                    activeConnector={activeConnector}
                    selectedConnector={selectedConnector}
                    setDisableButtonOnClick={setDisableButtonOnClick}
                    connect={connect}
                />
            )}
        </div>
    );
};
