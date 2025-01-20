/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useEffect, useState, type ReactElement } from "react";
import { parseEther } from "viem";
import { type Config, useEstimateGas, useSendTransaction } from "wagmi";
import { type ConnectMutate } from "wagmi/query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button, Spinner, toast } from "components/common";
// import { useConfirmJobPayment, useInviteTalentToJob } from "@/lib/api/job";
import type { I0xType, ConnectorProps, IAny } from "types";
import Logger from "lib/logger";

interface WalletDepositProps {
    isLoading: boolean;
    chainId: number;
    depositAddress: string;
    amount: number;
    selectedConnector: ConnectorProps | undefined;
    activeConnector: unknown;
    setDisableButtonOnClick: (v: boolean) => void;
    closeModel: () => void;
    connect: ConnectMutate<Config, unknown>;
}

export const DepositAvax = ({
    isLoading,
    chainId,
    depositAddress,
    amount,
    activeConnector,
    selectedConnector,
    closeModel,
    setDisableButtonOnClick,
    connect,
}: WalletDepositProps): ReactElement => {
    const [connectError, setConnectError] = useState<string | null>(null);

    const SendTxPayload = {
        chainId,
        to: depositAddress as I0xType,
        value: parseEther(amount.toString()),
    };

    const {
        // data: txConfig,
        error: isError,
        isLoading: IsPreparing,
    } = useEstimateGas({
        ...SendTxPayload,
    });

    const {
        sendTransaction,
        isLoading: txSending,
        error: txError,
    } = useSendTransaction();

    const isLoadingAll = txSending || isLoading;

    const MakePayment = async (): Promise<void> => {
        setDisableButtonOnClick(true);
        try {
            if (!activeConnector) {
                connect(
                    { connector: selectedConnector as IAny },
                    {
                        onError: (err) => {
                            setConnectError(err?.name);
                        },
                    }
                );
            }

            sendTransaction(
                { ...SendTxPayload },
                {
                    onSuccess() {},
                    onError(error: any) {
                        Logger.info("ggg", error);
                        toast.error(error.message);
                    },
                }
            );
        } catch (error: unknown) {
            Logger.info("MakePayment-Error", { error });
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
        <div>
            {/* @ts-ignore */}
            {selectedConnector &&
                ((isError && isError.name != "ChainMismatchError") ||
                    txError) && (
                    <div className="mb-4 flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500">
                        <span>
                            {(isError?.name || txError?.name) ==
                            "EstimateGasExecutionError"
                                ? "InsufficientFundsError: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
                                : connectError ||
                                  (isError?.message ??
                                      txError?.message ??
                                      "An error occurred while making payment.")}
                        </span>
                    </div>
                )}

            <Button
                disabled={isLoadingAll || IsPreparing || !!isError}
                onClick={() => {
                    MakePayment();
                }}
                fullWidth
                variant="primary"
                size="md"
            >
                <div className="flex items-center justify-center gap-2">
                    <span> Make Payment</span>{" "}
                    <span>{isLoadingAll && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};
