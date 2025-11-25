"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, Fragment, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "../../utils";
import { BrandLoader } from "./brand-loader";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    className?: string;
    children?: React.ReactNode;
    disableClickOutside?: boolean;
    isPreLoading?: boolean;
}

const Modal: FC<ModalProps> = ({
    children,
    isOpen,
    closeModal,
    className,
    disableClickOutside,
    isPreLoading = true,
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                open={isOpen}
                as="div"
                className="pam:relative !pam:z-[1000]"
                onClose={() => {
                    if (!disableClickOutside) {
                        closeModal();
                    }
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out "
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="pam:fixed pam:inset-0 pam:bg-modal-overlay pam:backdrop-blur-lg !pam:z-[1000]" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out "
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="pam:fixed pam:inset-0 pam:overflow-y-auto !pam:z-[1000]">
                        <div className="pam:flex pam:min-h-full pam:items-center pam:justify-center pam:p-4 pam:text-center">
                            <Dialog.Panel
                                className={cn(
                                    "pam:relative !pam:z-10 pam:w-full pam:max-w-lg pam:transform pam:overflow-hidden pam:bg-transparent pam:text-left pam:align-middle pam:transition-all pam:max-h-[750px] pam:w-[450px] pam:rounded-2xl",
                                    className
                                )}
                            >
                                {isPreLoading ? (
                                    <BrandLoader text="Loading..." />
                                ) : (
                                    children
                                )}
                            </Dialog.Panel>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default memo(Modal);
