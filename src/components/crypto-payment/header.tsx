import { ReactElement } from "react";
import { X } from "lucide-react";

const CryptoPaymentHeader = ({ closeModal }:{ closeModal: ()=>void}):ReactElement => {
  return (
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
)}

export default CryptoPaymentHeader;
