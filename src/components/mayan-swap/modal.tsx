
import Modal from 'components/common/modal';
import PaktWrapper from 'components/modal-wrapper';
import MayanSwapWidget from '.';
import { MayanSwapModalProps } from './types';
import { BasicModalProps } from 'types';

const MayanSwapModal = ({
  isOpen,
  closeModal,
  amount,
  onSuccessResponse,
  isLoading,
  destinationAddress,
  destinationChain,
  destinationToken
}: MayanSwapModalProps & BasicModalProps) => {
    return (
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <PaktWrapper showPakt>
            <MayanSwapWidget 
              isLoading={!!isLoading}
              amount={amount}
              onSuccessResponse={onSuccessResponse}
              destinationAddress={destinationAddress}
              destinationChain={destinationChain}
              destinationToken={destinationToken}
              closeModal={closeModal}
            />
        </PaktWrapper>
      </Modal>
      );
}


export default MayanSwapModal;
