"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { memo, ReactNode } from "react";
import { X } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import PoweredByPakt from "../powdered-by-pakt";

const PaktWrapper = ({
    children,
    showPakt,
    closeModal,
}: {
    children: ReactNode;
    showPakt?: boolean;
    closeModal?: () => void;
}) => {
    const isMobile = useMediaQuery("(max-width: 640px)");
    return (
        <div className="pam:mx-auto pam:flex pam:w-full pam:flex-col pam:gap-4 pam:sm:pam:max-w-[450px] pam:h-fit">
            <div className="pam:flex pam:w-full pam:items-center pam:justify-end">
                {closeModal && (
                    <button
                        className="pam:flex pam:items-center pam:justify-center pam:rounded-full pam:border pam:border-border-color pam:p-1 pam:text-heading-text pam:duration-200 pam:hover:pam:border-error-text pam:hover:pam:text-error-text max-sm:pam:size-[24px] pam:sm:pam:p-2"
                        onClick={closeModal}
                        type="button"
                        aria-label="Close"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                )}
            </div>
            {children}
            {!isMobile && showPakt && (
                <div className="pam:flex pam:w-full pam:items-center pam:justify-end">
                    <PoweredByPakt className="!pam:text-inverse-text" />
                </div>
            )}
        </div>
    );
};

export default memo(PaktWrapper);
