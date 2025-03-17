
import Modal from 'components/common/modal';
import PaktWrapper from 'components/modal-wrapper';
import MayanSwapWidget from './swap-new';
import { MayanSwapModalProps } from './types';
import { cn } from 'utils';
import useMayanSwapAction from './actions';

const MayanSwapModal = ({
  isOpen,
  closeModal,
  amount,
  coin,
  onSuccessResponse,
  isLoading,
  destinationChains,
  sourceChains,
  rpcs,
  tokensFrom,
  tokensTo,
  chain,
  collectionId
}: MayanSwapModalProps) => {

  const { loading, btnLoading, btnReady, mayanConfig, networksPayload, tokensPayload, swapPayload } = useMayanSwapAction({ 
    isOpen,
    closeModal,
    amount,
    coin,
    onSuccessResponse,
    isLoading,
    destinationChains,
    sourceChains,
    rpcs,
    tokensFrom,
    tokensTo,
    chain,
    collectionId
   });
  
    return (
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <PaktWrapper showPakt>
          <div className={cn("pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-6 pam-p-6 pam-bg-[#FCFCFD] pam-rounded-2xl pam-border pam-min-h-[500px]", `pam-bg-[${mayanConfig.colors?.background}]`)}>
            <MayanSwapWidget 
              isLoading={loading}
              btnLoading={btnLoading}
              btnReady={btnReady}
              closeModal={closeModal}
              networksPayload={networksPayload}
              tokensPayload={tokensPayload}
              swapPayload={swapPayload}
            />
          </div>
        </PaktWrapper>
      </Modal>
      );
}


export default MayanSwapModal;
