import { QueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { ITheme } from "types";
import { WagmiProviderProps } from "wagmi";
import { Config } from "wagmi";


interface ConfigContextType {
    theme?: ITheme; // colors to theme the package
    cryptoConfig?: {
      wagmiConfig: Config;
      wagmiProvider?: WagmiProviderProps;
      queryClient?: QueryClient;
      publicKey: string;
      theme?: "light" | "dark";
    };
    stripeConfig?: {
      clientSecret: string;
      publicKey: string;
      theme?: "light" | "dark";
    };
    errorHandler?: (errorMessage: string) => void; //  Callback to handle Error
}

export type { ConfigContextType };