
import Modal from 'components/common/modal';
import PaktWrapper from 'components/modal-wrapper';
import MayanSwapWidget from './swap-new';
import { MayanSwapModalProps } from './types';

const MayanSwapModal = ({
  isOpen,
  closeModal,
  amount,
  onSuccessResponse,
  isLoading,
  collectionId
}: MayanSwapModalProps) => {
    return (
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        disableClickOutside
      >
        <PaktWrapper showPakt>
            <MayanSwapWidget 
              isOpen={isOpen}
              isLoading={!!isLoading}
              amount={amount}
              collectionId={collectionId}
              closeModal={closeModal}
              onSuccessResponse={onSuccessResponse}
            />
        </PaktWrapper>
      </Modal>
      );
}


export default MayanSwapModal;
