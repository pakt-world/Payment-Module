"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import { erc20Abi, parseEther } from "viem";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { I0xAddressType, IAny } from "types";
import { Button, toast, Spinner } from "components/common";
import { ContractErrorType, WalletDepositProps } from "../../types";
import Logger from "lib/logger";

const DepositToken = ({
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
    connect,
    onSuccessResponse
}: WalletDepositProps): JSX.Element => {
    const [connectError, setConnectError] = useState<string | null>(null);
    
    const { data:ContractConfig, isError:contractIsError, error:contractError, isLoading:contrIsLoading, isLoadingError } = useSimulateContract({
        abi: erc20Abi,
        chainId,
        functionName: "transfer",
        address: `${contractAddress as I0xAddressType}`,
        args: [`${depositAddress as I0xAddressType}`, amountToPay],
        query: {
            enabled: !!activeConnector,
        },
    });

    const contrErr = contractError as ContractErrorType;

    const {
        writeContract,
        isError: writeIsError,
        error: writeError,
        isPending: writeLoading,
    } = useWriteContract({
        mutation: {
            onSuccess(data) {
                Logger.info(`contract-interaction-success-->`, { txId:data });
                // call on-finish-response-with-txId
                onSuccessResponse({ error:false, txId:data });
            },
            onError(error: any) {
                toast.error(error.message);
            },
        },
    });

    const isLoadingAll = isLoading || contrIsLoading || writeLoading;
    const isDisabledAll = isDisabled || disableButtonOnClick  || writeIsError|| contractIsError;

    if(contractIsError){
      Logger.error("contract-error", { ContractConfig, contractError, contractIsError, isLoadingError, writeLoading, writeIsError, writeError });
    }

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
                Logger.info(
                    "Contract configuration is missing., Connect wallet!"
                );
                throw new Error("Contract configuration is missing.");
            }
            return writeContract(ContractConfig.request);
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
        <div className="pam-flex pam-flex-col pam-gap-2">
            {selectedConnector && (writeError || contractError || connectError) && (
                    <div className="pam-flex pam-flex-col pam-items-center pam-gap-2 pam-rounded-lg pam-border pam-border-red-200 pam-bg-red-50 pam-p-2 pam-text-sm pam-text-red-500">
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
                    disabled={isLoadingAll ||isDisabledAll}
                    onClick={() => {}}
                    variant="primary"
                    size="md"
                >
                    {isLoadingAll ? <Spinner /> : "Confirm Payment"}
                </Button>
            )}

            <Button
                fullWidth
                disabled={isLoadingAll || isDisabledAll}
                onClick={() => {
                    MakePayment();
                }}
                variant="primary"
                size="md"
            >
                <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
                  <span>{writeLoading ? "Confirming Payment" : isLoadingAll ? "Loading...": "Open Wallet"}</span> 
                  <span> {isLoadingAll && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};

export default DepositToken;
