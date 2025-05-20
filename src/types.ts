/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { QueryClient } from "@tanstack/react-query";
import { WagmiProviderProps } from "wagmi";
import { Config } from "wagmi";

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
    errorHandler?: (errorMessage: string) => void; //  Callback to handle Error
}

export type { ConfigContextType };

interface BasicModalProps {
  config: ConfigContextType;
  isOpen: boolean;
  closeModal: () => void;
  collectionId: string;
}

interface onFinishResponseProps {
  status: string;
  txId: string;
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

export {
  IAny,
  I0xAddressType,
  type BasicModalProps,
  type onFinishResponseProps,
  type ITheme,
}
