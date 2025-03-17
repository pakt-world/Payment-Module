

import { ChevronLeft, X } from 'lucide-react';

import MayanIcon from "../../assets/images/mayan-icon.svg";

interface MayanHeaderProps {
  closeModal: ()=>void;
}

const MayanSwapHeader = ({closeModal }:MayanHeaderProps) => {
  return (
    <div className="pam-flex pam-w-full pam-items-center pam-justify-between">
      <button><ChevronLeft /></button>

      <h2 className="pam-text-lg pam-font-bold pam-text-title sm:pam-text-2xl">
          <img src={MayanIcon} width={124} height={32} />
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
  );
}


export default MayanSwapHeader;
