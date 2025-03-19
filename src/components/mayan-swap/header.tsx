

import { ChevronLeft, X } from 'lucide-react';

import MayanIcon from "../../assets/images/mayan-icon.svg";
import { VIEW_STEP } from './types';

interface MayanHeaderProps {
  goBack: () => void;
  closeModal: ()=>void;
  step: VIEW_STEP;
}

const MayanSwapHeader = ({ goBack, closeModal, step }:MayanHeaderProps) => {
  return (
    <div className="pam-flex pam-w-full pam-items-center pam-justify-between">
      <button className="pam-w-1/3 pam-justify-start" onClick={goBack}>
        <ChevronLeft />
      </button>

      <div className="pam-text-lg pam-font-bold pam-text-title sm:pam-text-2xl pam-w-fit">
          <img src={MayanIcon} width={124} height={32} />
      </div>

      <div className="pam-flex pam-flex-row pam-justify-end pam-items-end pam-gap-2 pam-w-1/3">
        <span className="pam-font-sans pam-text-tbody pam-text-[14px]">Step {step}/2</span>
        <button
          className="pam-flex pam-items-center pam-justify-center pam-rounded-full pam-border pam-border-[#DFDFE6] pam-text-black pam-duration-200 pam-hover:pam-border-danger hover:pam-text-danger max-sm:pam-size-[24px] pam-p-1"
          onClick={closeModal}
          type="button"
          aria-label="Close"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default MayanSwapHeader;
