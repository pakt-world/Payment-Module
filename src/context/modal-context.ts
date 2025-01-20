/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { createContext, useContext, ReactNode } from "react";

// Define the shape of your context
interface ModalContextType {
    modalData?: any;
    onOpenChange: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModalContext must be used within a ModalProvider");
    }

    return context;
};

export { useModalContext, ModalContext };
