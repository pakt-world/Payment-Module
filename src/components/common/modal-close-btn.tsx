/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "./button";

interface ModalCloseBtnProps {
    onClick: () => void;
    text?: string;
}

const ModalCloseBtn = ({ onClick, text }: ModalCloseBtnProps) => {
    return (
        <Button
            className="pam-flex !pam-h-[37px] !pam-w-[106px] pam-items-center pam-justify-center pam-gap-2 !pam-px-4 !pam-py-2 pam-font-bold sm:!pam-h-[51px] sm:!pam-w-[151px] sm:pam-gap-4"
            variant="secondary"
            onClick={onClick}
        >
            <XIcon className="pam-cursor-pointer pam-text-primary" />
            <span className="!pam-text-sm sm:!pam-text-lg">
                {text || "Cancel"}
            </span>
        </Button>
    );
};

export default ModalCloseBtn;
