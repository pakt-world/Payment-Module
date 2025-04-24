/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { toast } from "../components/common/toaster";

let globalErrorHandler: (errorMessage: string) => void = (message: string) => {
    toast.error(message);
};

const setGlobalErrorHandler = (handler: (errorMessage: string) => void) => {
    globalErrorHandler = handler;
};

const triggerGlobalError = (message: string) => {
    const errorMessage =
        message || "Sorry, An error occurred. Please try again.";
    globalErrorHandler(errorMessage);
};

export { setGlobalErrorHandler, triggerGlobalError };
