/* eslint-disable no-unused-vars */
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { QueryClient } from "@tanstack/react-query";
import { WagmiProviderProps, Config } from "wagmi";

interface ConfigContextType {
    theme?: ITheme; // colors to theme the package
    cryptoConfig?: {
        wagmiConfig: Config;
        wagmiProvider?: WagmiProviderProps;
        queryClient?: QueryClient;
    };
    stripeConfig?: {
        clientSecret: string;
        publicKey: string;
        theme?: "light" | "dark";
    };
    paktConfig: {
        baseUrl: string;
        verbose?: boolean;
    };
    errorHandler?: (errorMessage: string) => void; //  Callback to handle Error
}

export type { ConfigContextType };

interface BasicModalProps {
    config: ConfigContextType;
    isOpen: boolean;
    closeModal: () => void;
    collectionId: string;
}

interface onResponseProps {
    status: "success" | "error";
    message: string;
    txId: string;
    collectionId?: string;
}

type IAny = any;
type I0xAddressType = `0x${string}`;

interface ITheme extends Record<string, any> {
    primary?: string;
    secondary?: string;
    info?: string;
    line?: string;
    title?: string;
    body?: string;
    warning?: string;
    success?: string;
    danger?: string;
    magnolia?: string;
    "exhibit-tab-list"?: string;
    "primary-brighter"?: string;
    "refer-border"?: string;
    "btn-primary"?: string;
    "primary-gradient"?: string;
    "modal-radius"?: string;
}

interface PaymentData {
    amount: number;
    coin: string;
    description: string;
    isDirect: boolean;
    collectionType: string;
    owner: string;
    name: string;
}

export {
    IAny,
    I0xAddressType,
    type BasicModalProps,
    type onResponseProps,
    type ITheme,
    type PaymentData,
};
