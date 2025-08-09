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
import { Button, Spinner, toast } from "../../../common";
import type { I0xType, ConnectorProps } from "../../types";
import type { IAny, onResponseProps } from "../../../../types";
import Logger from "../../../../lib/logger";

interface WalletDepositProps {
    isLoading: boolean;
    // chainId: number;
    depositAddress: string;
    amount: number;
    selectedConnector: ConnectorProps | undefined;
    isDisabled: boolean;
    activeConnector: unknown;
    setDisableButtonOnClick: (v: boolean) => void; // eslint-disable-line no-unused-vars
    onResponse: (data: onResponseProps) => void; // eslint-disable-line no-unused-vars
    connect: ConnectMutate<Config, unknown>;
    disconnect: () => void;
}

const DepositCoin = ({
    isLoading,
    // chainId,
    depositAddress,
    amount,
    activeConnector,
    selectedConnector,
    setDisableButtonOnClick,
    connect,
    disconnect,
    onResponse,
    isDisabled,
}: WalletDepositProps): ReactElement => {
    const [connectError, setConnectError] = useState<string | null>(null);

    const SendTxPayload = {
        to: depositAddress as I0xType,
        value: parseEther(String(amount)),
    };

    const {
        // data: txConfig,
        error: ErrorMsg,
        isError,
        isLoading: IsPreparing,
    } = useEstimateGas({
        ...SendTxPayload,
        query: {
            retry: false,
        },
    });

    if (isError) {
        Logger.error("payment-error", { isError, ErrorMsg, IsPreparing });
    }

    const {
        sendTransaction,
        isPending: txSending,
        error: txError,
    } = useSendTransaction();

    const isLoadingAll = isLoading || txSending || IsPreparing || !!isError;

    const TriggerPayment = () =>
        sendTransaction(
            { ...SendTxPayload },
            {
                onSuccess(data) {
                    Logger.info(`send-tx-success-->`, { txId: data });
                    disconnect();
                    onResponse({
                        status: "success",
                        message: "Payment successful",
                        txId: data,
                    });
                },
                onError(error: any) {
                    Logger.info("ggg", error);
                    toast.error(error.message);
                    onResponse({
                        status: "error",
                        message: error.message,
                        txId: "",
                    });
                },
            }
        );

    const ConnectWallet = () =>
        connect(
            { connector: selectedConnector as IAny },
            {
                onError: (err) => {
                    setConnectError(err?.name);
                    Logger.error("connect-error-", { err });
                },
                onSuccess: () => TriggerPayment(),
            }
        );

    const MakePayment = async (): Promise<void> => {
        setDisableButtonOnClick(true);
        try {
            if (!activeConnector) {
                return ConnectWallet();
            }
            return TriggerPayment();
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
            {selectedConnector &&
                ((isError &&
                    (isError as any)?.name !== "ConnectorChainMismatchError") ||
                    txError) && (
                    <div className="pam:mb-4 pam:flex pam:flex-col pam:items-center pam:gap-2 pam:rounded-lg pam:border pam:border-error-border pam:bg-error-background pam:p-2 pam:text-sm pam:text-error-text">
                        <span>
                            {(ErrorMsg?.name || txError?.name) ===
                            "EstimateGasExecutionError"
                                ? "InsufficientFundsError: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
                                : connectError ||
                                  (ErrorMsg?.message ??
                                      txError?.message ??
                                      "An error occurred while making payment.")}
                        </span>
                    </div>
                )}

            <Button
                disabled={isDisabled || isLoadingAll}
                onClick={() => {
                    if (!activeConnector) {
                        ConnectWallet();
                    } else {
                        MakePayment(); // eslint-disable-line @typescript-eslint/no-floating-promises
                    }
                }}
                fullWidth
                variant="primary"
                size="md"
            >
                <div className="pam:flex pam:items-center pam:justify-center pam:gap-2">
                    <span>
                        {" "}
                        {!activeConnector ? "Connect Wallet" : "Make Payment"}
                    </span>
                    <span>{isLoadingAll && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};

export default React.memo(DepositCoin);
