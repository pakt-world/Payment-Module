// Import PAKT SDK types and classes
import {
    PaktSDK,
    ICreateDirectDepositPayload,
} from "pakt-sdk";

export interface PaktSDKConfig {
    baseUrl: string;
    testnet?: boolean;
    verbose?: boolean;
}

export interface PaymentResponse<T = any> {
    status: "success" | "error";
    message: string;
    data: T;
    statusCode?: number;
    code?: number;
}

class PaktSDKService {
    private sdk: any = null;
    private config: PaktSDKConfig | null = null;
    private isInitialized: boolean = false;
    private authToken: string | null = null;

    async initialize(config: PaktSDKConfig): Promise<void> {
        try {
            this.config = config;
            this.sdk = await PaktSDK.init(config);
            this.isInitialized = true;
            console.log("PAKT SDK initialized");
        } catch (error) {
            this.isInitialized = false;
            throw new Error(`Failed to initialize PAKT SDK: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private ensureInitialized(): any {
        if (!this.isInitialized || !this.sdk) {
            throw new Error("PAKT SDK not initialized. Call initialize() first.");
        }
        return this.sdk;
    }

    private createErrorResponse<T>(error: unknown, defaultMessage: string): PaymentResponse<T> {
        return {
            status: "error",
            message: error instanceof Error ? error.message : defaultMessage,
            data: null as T,
            statusCode: 500
        };
    }

    // Check if SDK is initialized
    getInitialized(): boolean {
        console.log("PAKT SDK initialized", this.isInitialized);
        return this.isInitialized;
    }

    // Get current config
    getConfig(): PaktSDKConfig | null {
        return this.config;
    }

    // Authentication Methods
    async makeDirectDeposit(payload: ICreateDirectDepositPayload): Promise<PaymentResponse<any>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.directDeposit.createDirectDeposit({
                authToken: this.authToken,
                payload,
              });
            return response as PaymentResponse<any>;
        } catch (error) {
            console.log("====>", error)
            return this.createErrorResponse<any>(error, "Login failed");
        }
    }

    async validateDirectDeposit(payload: any): Promise<PaymentResponse<any>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.directDeposit.validateDirectDeposit({
                authToken: payload.authToken,
                payload,
              });
            return response as PaymentResponse<any>;
        } catch (error) {
            return this.createErrorResponse<any>(error, "Validate direct deposit failed");
        }
    }

    // Reset SDK state (useful for testing or re-initialization)
    reset(): void {
        this.sdk = null;
        this.config = null;
        this.isInitialized = false;
    }
}

// Export a singleton instance
export const paktSDKService = new PaktSDKService();

// Export types for use in components
// Export types when they become available in pakt-sdk
// export type {
//     ICreateDirectDepositPayload,
//     IValidateDirectDepositPayload,
//     ICreateDirectDepositResponse,
//     IValidateDirectDepositResponse,
//     ICreatePaymentPayload,
// }; 