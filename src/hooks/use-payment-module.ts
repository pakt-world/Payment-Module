/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { paktSDKService } from "../lib/pakt-sdk";
import type {
    PaymentResponse,
} from "../lib/pakt-sdk";

interface Payment {
    collectionId?: string;
    token?: string;
    pKey?: string;
    amount?: number;
    currency?: string;
    [key: string]: any;
}

interface UsePaymentModuleReturn {
    // State
    payment: Payment | null;
    loading: boolean;
    error: string | null;
    
    // Authentication Methods
    initiateCryptoPayment: (payload: any) => Promise<PaymentResponse<any>>;
    validateCryptoPayment: (payload: any) => Promise<PaymentResponse<any>>;
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
    const createErrorResponse = useCallback(<T>(errorMessage: string, defaultMessage: string): PaymentResponse<T> => {
        const message = errorMessage || defaultMessage;
        setError(message);
        return {
            status: 'error',
            message,
            data: null as unknown as T,
            statusCode: 500
        };
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear user
    const clearPayment = useCallback(() => {
        setPayment(null);
    }, []);

    // Initiate crypto payment
    const initiateCryptoPayment = useCallback(async (payload: any): Promise<PaymentResponse<any>> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await paktSDKService.makeDirectDeposit(payload);
            
            if (response.status === 'success' && response.data) {
                setPayment(response.data);
            } else {
                setError(response.message || 'Payment failed');
            }
            
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            return createErrorResponse<any>(errorMessage, 'Payment failed');
        } finally {
            setLoading(false);
        }
    }, [createErrorResponse]);
    
    // validate crypto payment
    const validateCryptoPayment = useCallback(async (payload: any): Promise<PaymentResponse<any>> => {
        console.log("validateCryptoPayment", payload);
        setLoading(true);
        setError(null);
        
        try {
            const response = await paktSDKService.validateDirectDeposit(payload);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            return createErrorResponse<any>(errorMessage, 'Payment failed');
        } finally {
            setLoading(false);
        }
    }, [createErrorResponse]);


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