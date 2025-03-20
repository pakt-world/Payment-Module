/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReactElement, useState } from "react";
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
import MayanSwapWidget from "components/mayan-swap";
import CryptoPaymentWidget from "./widget";

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
    isLoading,
}: CryptoPaymentModalProps): ReactElement => {
    const [useSwap, setOpenSwap] = useState<boolean>(false);
    return (
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <PaktWrapper showPakt>
         {!useSwap ? <CryptoPaymentWidget
            isOpen={isOpen}
            closeModal={closeModal}
            amount={amount}
            coin={coin}
            depositAddress={depositAddress}
            contractAddress={contractAddress}
            chainId={chainId}
            tokenDecimal={tokenDecimal}
            onSuccessResponse={onSuccessResponse}
            isLoading={isLoading}
            openSwap={()=>setOpenSwap(true)}
          />
          : 
          <MayanSwapWidget 
            isLoading={!!isLoading}
            amount={amount}
            closeModal={closeModal}
            destinationAddress={depositAddress}
            onSuccessResponse={onSuccessResponse}
            destinationToken={coin}
            destinationChain={chainId}
            goBack={()=>setOpenSwap(false)}
          />
          }
        </PaktWrapper>
      </Modal>
    );
};

export default CryptoPaymentModal;
