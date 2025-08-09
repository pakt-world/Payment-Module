/* eslint-disable no-unused-vars */
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { QueryClient } from "@tanstack/react-query";
import { WagmiProviderProps, Config } from "wagmi";
import type { PaktConfig } from "pakt-sdk";

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
    paktConfig: PaktConfig;
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
    // Brand Colors
    brandPrimary?: string;
    brandSecondary?: string;
    brandAccent?: string;

    // Text Colors
    headingText?: string;
    bodyText?: string;
    linkText?: string;
    inverseText?: string;

    // Background Colors
    formBackground?: string;
    modalOverlay?: string;
    pageBackground?: string;
    cardBackground?: string;

    // Border Colors
    borderColor?: string;
    dividerColor?: string;

    // Interactive Elements
    buttonPrimaryBackground?: string;
    buttonPrimaryText?: string;
    buttonPrimaryHover?: string;
    buttonOutlineBackground?: string;
    buttonOutlineText?: string;
    buttonOutlineBorder?: string;
    buttonOutlineHoverBackground?: string;
    buttonOutlineHoverText?: string;

    // Form Input Colors
    inputBackground?: string;
    inputBorder?: string;
    inputFocusBorder?: string;
    inputPlaceholder?: string;
    inputText?: string;
    inputLabel?: string;

    // State Colors
    errorBackground?: string;
    errorText?: string;
    errorBorder?: string;
    successBackground?: string;
    successText?: string;
    warningBackground?: string;
    warningText?: string;

    // Gradients
    primaryGradient?: string;
    secondaryGradient?: string;

    // Spacing and Layout
    modalBorderRadius?: string;

    // Legacy Support (deprecated but kept for backward compatibility)
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
    "blue-lightest"?: string;
    "blue-darkest"?: string;

    // Nested structure for complex token groups (kept for backward compatibility)
    text?: {
        primary?: string;
        secondary?: string;
        inverse?: string;
    };

    input?: {
        background?: string;
        border?: string;
        focus?: string;
        placeholder?: string;
        text?: string;
        label?: string;
    };

    states?: {
        error?: {
            background?: string;
            text?: string;
            border?: string;
        };
        success?: {
            background?: string;
            text?: string;
        };
        warning?: {
            background?: string;
            text?: string;
        };
    };
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
