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
import PoweredByPakt  from "components/powdered-by-pakt";
import Modal from "components/common/modal";
import { ConnectWallet } from "./connect-wallet";
import { DepositToAddress } from "./deposit-to-address";

const MakeCryptoPaymentModal = ({
    isOpen,
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
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-4 sm:pam-max-w-[400px]">
          <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-6 pam-bg-white pam-p-6 pam-rounded-2xl pam-border">
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
                      <Tabs.List className="pam-grid pam-grid-cols-2 pam-gap-1 pam-rounded-lg pam-bg-[#F0F2F5] pam-p-0.5 pam-text-base pam-text-[#828A9B]">
                          <Tabs.Trigger
                              className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 hover:bg-white radix-state-active:pam-bg-white"
                              value="connect-wallet"
                          >
                              Connect Wallet
                          </Tabs.Trigger>
                          <Tabs.Trigger
                              className="pam-rounded-lg pam-p-2 pam-px-2 pam-duration-200 pam-hover:bg-white radix-state-active:pam-bg-white"
                              value="deposit-to-address"
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
                          />
                      </Tabs.Content>
                      <Tabs.Content value="deposit-to-address">
                          <DepositToAddress
                              coin={coin}
                              amount={amount}
                              depositAddress={depositAddress}
                          />
                      </Tabs.Content>
                  </Tabs.Root>
              </div>
          </div>
          {!isMobile && (
              <div className="pam-flex pam-w-full pam-items-center pam-justify-end">
                  <PoweredByPakt className="!pam-text-white" />
              </div>
          )}
        </div>
      </Modal>
    );
};

export default MakeCryptoPaymentModal;
