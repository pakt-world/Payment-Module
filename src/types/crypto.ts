/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

interface BasicModalProps {
  isOpen: boolean;
  closeModal: () => void;
  collectionId: string;
}

type I0xAddressType = `0x${string}`;

interface onFinishResponseProps {
  status: string;
  txId: string;
}

export {
  BasicModalProps,
  I0xAddressType,
  onFinishResponseProps,
}
