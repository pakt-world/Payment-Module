/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactElement } from "react";
import * as Tabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CryptoPaymentModalProps } from "./types";
import Modal from "components/common/modal";
import ConnectWallet from "./connect-wallet";
import DepositToAddress from "./address-deposit";
import PaktWrapper from "components/modal-wrapper";
import CryptoPaymentHeader from "./header";


const CryptoPaymentWidget = ({
  isOpen,
  closeModal,
  amount,
  coin,
  depositAddress,
  contractAddress,
  chainId,
  tokenDecimal,
  onSuccessResponse,
  isLoading,
  openSwap,
}:CryptoPaymentModalProps): ReactElement => {
  return (
    <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-6 pam-bg-white pam-p-6 pam-rounded-2xl pam-border">
        <CryptoPaymentHeader closeModal={closeModal} />
        <div className="pam-flex pam-grow pam-flex-col pam-items-center pam-justify-center">
            <Tabs.Root
                defaultValue="connect-wallet"
                className="pam-relative pam-flex pam-w-full pam-flex-col pam-gap-6"
            >
                <Tabs.List className="pam-grid pam-grid-cols-2 pam-gap-1 pam-rounded-lg pam-bg-[#F0F2F5] pam-p-0.5 pam-text-base pam-text-[#828A9B]">
                    <Tabs.Trigger
                        className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 hover:bg-white radix-state-active:pam-bg-white"
                        value="connect-wallet"
                        disabled={isLoading}
                    >
                        Connect Wallet
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 pam-hover:bg-white radix-state-active:pam-bg-white"
                        value="deposit-to-address"
                        disabled={isLoading}
                    >
                        Deposit To Address
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="connect-wallet">
                    <ConnectWallet
                        amount={amount}
                        depositAddress={depositAddress}
                        contractAddress={contractAddress}
                        tokenDecimal={tokenDecimal}
                        chainId={chainId}
                        onSuccessResponse={onSuccessResponse}
                        isLoading={isLoading}
                        openSwap={openSwap}
                    />
                </Tabs.Content>
                <Tabs.Content value="deposit-to-address">
                    <DepositToAddress
                        coin={coin}
                        amount={amount}
                        depositAddress={depositAddress}
                        onSuccessResponse={onSuccessResponse}
                        isLoading={isLoading}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    </div>
    )
}


export default CryptoPaymentWidget;
