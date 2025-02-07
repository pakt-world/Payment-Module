"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { I0xAddressType, IAny } from "types";
import { Button, toast, Spinner } from "components/common";
import { WalletDepositProps } from "../../types";
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

    const {
        writeContract,
        isError: writeIsError,
        error: writeError,
        isPending: writeLoading,
    } = useWriteContract({
        mutation: {
            onSuccess(data) {
                Logger.info(`contract-interaction-success-->`, { txId:data });
                onSuccessResponse({ status:"completed", txId:data });
            },
            onError(error: any) {
                toast.error(error.message);
            }
        },
    });

    const isLoadingAll = isLoading || writeLoading;
    const isDisabledAll = isDisabled || disableButtonOnClick  || writeIsError;

    if(writeIsError){
      Logger.error("contract-error", { writeLoading, writeIsError, writeError, isDisabledAll, isLoadingAll });
    }

    const TriggerPayment = async () => {
      try {
        return writeContract({
          abi: erc20Abi,
          chainId,
          functionName: "transfer",
          address: `${contractAddress as I0xAddressType}`,
          args: [`${depositAddress as I0xAddressType}`, amountToPay],
        });
      } catch (error) {
        console.log("error-->", { error});
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("An unknown error occurred.");
        }
      }
    };

    const ConnectWallet = () => 
      connect(
          { connector: selectedConnector as IAny },
          {
              onError: (err) => {
                setConnectError(err?.name);
                return;
              },
              onSuccess: ()=> TriggerPayment()
          }
      );

    const MakePayment = async (): Promise<void> => {
        try {
          if (!activeConnector) {
              return ConnectWallet();
          }
          return TriggerPayment();
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
            {selectedConnector && (writeError || connectError) && (
                    <div className="pam-flex pam-flex-col pam-items-center pam-gap-2 pam-rounded-lg pam-border pam-border-red-200 pam-bg-red-50 pam-p-2 pam-text-sm pam-text-red-500">
                        <span>
                            {connectError ||
                                // @ts-ignore
                                writeError?.cause?.reason ||
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
                disabled={isLoadingAll || isDisabledAll }
                onClick={() => {
                  !activeConnector ? ConnectWallet() :MakePayment();
                }}
                variant="primary"
                size="md"
            >
                <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
                  <span>{!activeConnector ? "Connect Wallet": writeLoading ? "Confirming Payment" : isLoadingAll ? "Loading...": "Make Payment"}</span> 
                  <span> {isLoadingAll && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};

export default React.memo(DepositToken);
