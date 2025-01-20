"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSimulateContract, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import { useConfirmJobPayment, useInviteTalentToJob } from "@/lib/api/job";
import { Button, toast, Spinner } from "components/common";
import { IAny, ContractErrorType, WalletDepositProps } from "types";
import Logger from "lib/logger";
import { useEffect, useState } from "react";

export const DepositUSDC = ({
    chainId,
    contractAddress,
    depositAddress,
    amountToPay,
    selectedConnector,
    activeConnector,
    isDisabled,
    showReconfirmButton,
    isLoading,
    disableButtonOnClick,
    setDisableButtonOnClick,
    setShowReconfirmButton,
    closeModel,
    connect,
}: WalletDepositProps): JSX.Element => {
    const [connectError, setConnectError] = useState<string | null>(null);

    const { data: ContractConfig, error: contractError } = useSimulateContract({
        abi: erc20Abi,
        chainId,
        functionName: "transfer",
        address: `0x${contractAddress?.substring(2)}`,
        args: [`0x${depositAddress.substring(2)}`, amountToPay],
        query: {
            enabled: !!activeConnector,
        },
    });

    const contrErr = contractError as ContractErrorType;

    const {
        writeContract,
        error: writeError,
        isLoading: writeLoading,
    } = useWriteContract({
        mutation: {
            onSuccess() {
                // confirmValuePayment();
                Logger.info(`contract-interaction-success-->`);
            },
            onError(error: any) {
                toast.error(error.message);
            },
        },
    });

    const isLoadingAll = isLoading || writeLoading || disableButtonOnClick;

    const MakePayment = async (): Promise<void> => {
        try {
            if (!activeConnector) {
                return connect(
                    { connector: selectedConnector as IAny },
                    {
                        onError: (err) => {
                            setConnectError(err?.name);
                        },
                    }
                );
            }
            if (!ContractConfig) {
                // throw new Error("Contract configuration is missing.");
                Logger.info(
                    "Contract configuration is missing., Connect wallet!"
                );
                return;
            }

            writeContract(ContractConfig.request);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    // Clear Error when selector changes in state/value
    useEffect(() => {
        if (selectedConnector) {
            setConnectError(null);
        }
    }, [selectedConnector]);

    return (
        <div className="flex flex-col gap-2">
            {selectedConnector &&
                (writeError || contractError || connectError) && (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500">
                        <span>
                            {contrErr?.shortMessage ||
                                // @ts-ignore
                                writeError?.cause?.reason ||
                                connectError ||
                                "An error occurred while making payment."}
                        </span>
                    </div>
                )}

            {showReconfirmButton && (
                <Button
                    fullWidth
                    disabled={isDisabled || !!contrErr}
                    onClick={() => {}}
                    variant="primary"
                    size="md"
                >
                    {isLoadingAll ? <Spinner /> : "Confirm Payment"}
                </Button>
            )}

            <Button
                fullWidth
                disabled={isLoadingAll || isDisabled || !!contractError}
                onClick={() => {
                    MakePayment();
                }}
                variant="primary"
                size="md"
            >
                <div className="flex items-center justify-center gap-2">
                    <span>
                        {" "}
                        {isLoadingAll ? "Confirming Payment" : "Open Wallet"}
                    </span>{" "}
                    <span>{isLoadingAll && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};
