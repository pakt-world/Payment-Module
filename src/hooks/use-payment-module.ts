/* eslint-disable no-unused-vars */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useState } from "react";
import { ICreateDirectDepositPayload, ICreateDirectDepositResponse } from "pakt-sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { paktSDKService } from "../lib/pakt-sdk";
import type { PaymentResponse } from "../lib/pakt-sdk";

interface Payment {
    collectionId?: string;
    token?: string;
    pKey?: string;
    amount?: number;
    currency?: string;
    [key: string]: any;
}

export interface UsePaymentModuleReturn {
    // State
    payment: Payment | null;
    loading: boolean;
    error: string | null;

    // Authentication Methods
    initiateCryptoPayment: (payload: any) => Promise<PaymentResponse<any>>;
    validateCryptoPayment: (
        collectionId: string,
        chainId: string,
        retries?: number,
        retryDelay?: number
    ) => Promise<PaymentResponse<any>>;
    // initiateFiatPayment: (payload: IValidateDirectDepositPayload) => Promise<PaymentResponse<IValidateDirectDepositResponse>>;

    // Utility Methods
    clearError: () => void;
    clearPayment: () => void;
}

export const usePaymentModule = (): UsePaymentModuleReturn => {
    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to create error response
    const createErrorResponse = useCallback(
        <T>(
            errorMessage: string,
            defaultMessage: string
        ): PaymentResponse<T> => {
            const message = errorMessage || defaultMessage;
            setError(message);
            return {
                status: "error",
                message,
                data: null as unknown as T,
                statusCode: 500,
            };
        },
        []
    );

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear user
    const clearPayment = useCallback(() => {
        setPayment(null);
    }, []);

    // Initiate crypto payment
    const initiateCryptoPayment = useCallback(
        async (payload: ICreateDirectDepositPayload): Promise<PaymentResponse<ICreateDirectDepositResponse>> => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await paktSDKService.makeDirectDeposit(payload);

                if (response.status === "success" && response.data) {
                    setPayment(response.data);
                } else {
                    setError(response.message || "Payment failed");
                }

                return response;
            } catch (errorr: any) {
                const errorMessage =
                    errorr instanceof Error ? errorr.message : "Payment failed";
                return createErrorResponse<any>(errorMessage, "Payment failed");
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse]
    );

    // validate crypto payment
    const validateCryptoPayment = useCallback(
        async (
            collectionId: string,
            chainId: string,
            retries: number = 10,
            retryDelay: number = 2000
        ): Promise<PaymentResponse<any>> => {
            const maxRetries = retries;
            setLoading(true);
            setError(null);

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                console.log("attempt--number", attempt);
                try {
                    const response = await paktSDKService.validateDirectDeposit(
                        {
                            collection: collectionId,
                            chainId: chainId,
                        }
                    );
                    if (response.status !== "success") {
                        throw new Error(response.message || "Payment failed");
                    }
                    return response;
                } catch (errorr: any) {
                    console.log(`Attempt ${attempt} failed:`, errorr);

                    if (attempt === maxRetries) {
                        const errorMessage =
                            errorr instanceof Error
                                ? errorr.message
                                : "Payment failed";
                        return createErrorResponse<any>(
                            errorMessage,
                            "Payment failed after maximum retries"
                        );
                    }

                    // Wait before retrying
                    await new Promise((resolve) =>
                        setTimeout(resolve, retryDelay)
                    );
                }
            }

            // This should never be reached, but TypeScript requires it
            return createErrorResponse<any>(
                "Unexpected error",
                "Payment failed"
            );
        },
        [createErrorResponse]
    );

    return {
        // State
        payment,
        loading,
        error,

        // Authentication Methods
        initiateCryptoPayment,
        validateCryptoPayment,

        // Utility Methods
        clearError,
        clearPayment,
    };
};
