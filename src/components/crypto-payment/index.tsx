/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import { X } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CryptoPaymentModalProps } from "types";
import { PoweredByPakt } from "components/powdered-by-pakt";
import { ConnectWallet } from "./connect-wallet";
import { DepositToAddress } from "./deposit-to-address";

const MakeCryptoPaymentModal = ({
    closeModal,
    amount,
    coin,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
}: CryptoPaymentModalProps): ReactElement => {
    const isMobile = useMediaQuery("(max-width: 640px)");
    return (
        <div className="mx-auto flex w-full flex-col gap-4 sm:max-w-[400px]">
            <div className="mx-auto flex w-full flex-col gap-6 bg-white p-6 sm:rounded-2xl sm:border">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-lg font-bold text-title sm:text-2xl">
                        Make Payment
                    </h2>

                    <button
                        className="flex items-center justify-center rounded-full border border-[#DFDFE6] p-1 text-black duration-200 hover:border-danger hover:text-danger max-sm:size-[24px] sm:p-2"
                        onClick={closeModal}
                        type="button"
                        aria-label="Close"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>

                <div className="flex grow flex-col items-center justify-center">
                    <Tabs.Root
                        defaultValue="connect-wallet"
                        className="relative flex w-full flex-col gap-6"
                    >
                        <Tabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
                            <Tabs.Trigger
                                className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                                value="connect-wallet"
                            >
                                Connect Wallet
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                                value="deposit-to-address"
                            >
                                Deposit To Address
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="connect-wallet">
                            <ConnectWallet
                                // jobId={jobId}
                                closeModel={closeModal}
                                amount={amount}
                                depositAddress={depositAddress}
                                contractAddress={contractAddress}
                                tokenDecimal={tokenDecimal}
                                chainId={chainId}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="deposit-to-address">
                            <DepositToAddress
                                coin={coin}
                                closeModel={closeModal}
                                amount={amount}
                                depositAddress={depositAddress}
                            />
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
            {!isMobile && (
                <div className="flex w-full items-center justify-end">
                    <PoweredByPakt className="!text-white" />
                </div>
            )}
        </div>
    );
};

export default MakeCryptoPaymentModal;
