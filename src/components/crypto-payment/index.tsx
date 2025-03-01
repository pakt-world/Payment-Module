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
import Modal from "components/common/modal";
import ConnectWallet from "./connect-wallet";
import DepositToAddress from "./address-deposit";
import PaktWrapper from "components/modal-wrapper";

const CryptoPaymentModal = ({
    isOpen,
    closeModal,
    amount,
    coin,
    depositAddress,
    contractAddress,
    chainId,
    tokenDecimal,
    onSuccessResponse,
    isLoading
}: CryptoPaymentModalProps): ReactElement => {
    return (
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <PaktWrapper showPakt>
          <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-6 pam-bg-modal-color pam-p-6 pam-rounded-2xl pam-border pam-border-primary">
              <div className="pam-flex pam-w-full pam-items-center pam-justify-between">
                  <h2 className="pam-text-lg pam-font-bold pam-text-title sm:pam-text-2xl">
                      Make Payment
                  </h2>

                  <button
                      className="pam-flex pam-items-center pam-justify-center pam-rounded-full pam-border pam-border-[#DFDFE6] pam-p-1 pam-text-black pam-duration-200 pam-hover:pam-border-danger hover:pam-text-danger max-sm:pam-size-[24px] sm:pam-p-2"
                      onClick={closeModal}
                      type="button"
                      aria-label="Close"
                  >
                      <X size={16} strokeWidth={2} />
                  </button>
              </div>

              <div className="pam-flex pam-grow pam-flex-col pam-items-center pam-justify-center">
                  <Tabs.Root
                      defaultValue="connect-wallet"
                      className="pam-relative pam-flex pam-w-full pam-flex-col pam-gap-6"
                  >
                      <Tabs.List className="pam-grid pam-grid-cols-2 pam-gap-1 pam-rounded-lg pam-bg-secondary pam-p-0.5 pam-text-base pam-text-primary">
                          <Tabs.Trigger
                              className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 pam-hover:bg-btn-primary pam-opacity-30 radix-state-active:pam-opacity-100 radix-state-active:pam-bg-btn-primary radix-state-active:pam-text-secondary"
                              value="connect-wallet"
                              disabled={isLoading}
                          >
                              Connect Wallet
                          </Tabs.Trigger>
                          <Tabs.Trigger
                              className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 pam-hover:bg-btn-primary pam-opacity-30 radix-state-active:pam-opacity-100 radix-state-active:pam-bg-btn-primary radix-state-active:pam-text-secondary"
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
        </PaktWrapper>
      </Modal>
    );
};

export default CryptoPaymentModal;
