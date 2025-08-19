/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactElement } from "react";
import { X } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CryptoPaymentModalProps } from "./types";
import Modal from "../common/modal";
import ConnectWallet from "./connect-wallet";
import DepositToAddress from "./address-deposit";
import PaktWrapper from "../modal-wrapper";
import ErrorToaster from "../errorToaster";

const CryptoPayment = ({
    isOpen,
    closeModal,
    amount,
    coin,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
    onResponse,
    isLoading,
    isPreLoading = true,
}: CryptoPaymentModalProps): ReactElement => {
    return (
        <Modal
            isOpen={isOpen}
            closeModal={closeModal}
            disableClickOutside
            isPreLoading={isPreLoading}
        >
            <PaktWrapper showPakt>
                <ErrorToaster />
                <div className="pam:mx-auto pam:flex pam:w-full pam:h-full pam:flex-col pam:gap-6 pam:bg-form-background pam:p-6 pam:rounded-2xl pam:border pam:border-border-color">
                    <div className="pam:flex pam:w-full pam:items-center pam:justify-between">
                        <h2 className="pam:text-lg pam:font-bold pam:text-heading-text pam:sm:pam:text-2xl">
                            Make Payment
                        </h2>

                        <button
                            className="pam:flex pam:items-center pam:justify-center pam:rounded-full pam:border pam:border-border-color pam:p-1 pam:text-heading-text pam:duration-200 pam:hover:pam:border-error-text pam:hover:pam:text-error-text max-sm:pam:size-[24px] pam:sm:pam:p-2"
                            onClick={closeModal}
                            type="button"
                            aria-label="Close"
                        >
                            <X size={16} strokeWidth={2} />
                        </button>
                    </div>
                    <div className="pam:flex pam:grow pam:flex-col pam:items-center pam:justify-center">
                        <Tabs.Root
                            defaultValue="connect-wallet"
                            className="pam:relative pam:flex pam:w-full pam:flex-col pam:gap-6"
                        >
                            <Tabs.List
                                className="pam:grid pam:grid-cols-2 pam:gap-1 pam:rounded-lg pam:bg-tab-background pam:p-0.5 pam:text-base pam:text-tab-text"
                                color="white"
                            >
                                <Tabs.Trigger
                                    className="pam:rounded-lg pam:p-2 pam:px-2 pam:duration-200 pam:hover:bg-title-text pam:data-[state=active]:text-tab-active-text pam:data-[state=active]:bg-tab-active-background"
                                    value="connect-wallet"
                                    disabled={isLoading}
                                >
                                    Connect Wallet
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    className="pam:rounded-lg pam:p-2 pam:px-2 pam:duration-200 pam:hover:bg-title-text pam:data-[state=active]:text-tab-active-text pam:data-[state=active]:bg-tab-active-background"
                                    value="deposit-to-address"
                                    disabled={isLoading}
                                >
                                    Deposit To Address
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content
                                value="connect-wallet"
                                className="pam:h-[500px]"
                            >
                                <ConnectWallet
                                    amount={amount}
                                    depositAddress={depositAddress}
                                    contractAddress={contractAddress}
                                    tokenDecimal={tokenDecimal}
                                    chainId={chainId}
                                    onResponse={onResponse}
                                    isLoading={isLoading}
                                    coin={coin}
                                />
                            </Tabs.Content>
                            <Tabs.Content value="deposit-to-address">
                                <DepositToAddress
                                    coin={coin}
                                    amount={amount}
                                    depositAddress={depositAddress}
                                    onResponse={onResponse}
                                    isLoading={isLoading}
                                />
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </div>
            </PaktWrapper>
        </Modal>
    );
};

export default CryptoPayment;
