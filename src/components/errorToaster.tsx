import { CircleX } from "lucide-react";
import { useConfig } from "../context/config-context";
// import { useEffect } from "react";


const ErrorToaster = () => {
    const { error, setErrorMessage } = useConfig();

    // Auto-clear error message after 5 seconds
    // useEffect(() => {
    //     if (error) {
    //         const timeout = setTimeout(() => {
    //             setErrorMessage(null);
    //         }, 10000);

    //         return () => clearTimeout(timeout);
    //     }
    // }, [error, setErrorMessage]);

    if (!error) return null;

    return (
    <div className="pam:flex pam:flex-col pam:items-center pam:gap-2 pam:rounded-lg pam:border pam:border-error-border pam:bg-error-background pam:p-2 pam:text-sm pam:text-error-text">
        <span>
            {error|| "An error occurred while making payment."}
        </span>
        <span className="pam:absolute pam:right-2 pam:top-7 pam:cursor-pointer pam:text-sm pam:text-error-text" onClick={() => setErrorMessage(null)}><CircleX size={16} strokeWidth={2} /></span>
    </div>
    )
}

export default ErrorToaster;