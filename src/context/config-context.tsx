/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { type AxiosInstance } from "axios";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config, type WagmiProviderProps } from "wagmi";
import { structuralSharing } from '@wagmi/core/query';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { setAxiosInstance } from "lib/axios-instance";
import { setGlobalErrorHandler } from "lib/error-handler";
import { applyTheme } from "utils";
import { ITheme } from "types";
import defaultTheme from "styles/default-theme";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/index.scss";
import { MayanConfigProps } from "components/mayan-swap/types";


interface ConfigContextType {
    axiosInstance?: AxiosInstance; // Optional Axios instance
    baseURL?: string; // Base URL for API requests
    queryClient?: QueryClient; // Optional React Query client
    wagmiProvider?: WagmiProviderProps // Optional React Wagmi Provider
    publicKey?: string; // Optional publicKey
    clientId?: string; // Optional clientId
    token?: string; // Optional Bearer token
    timezone: string; //  Timezone
    errorHandler?: (errorMessage: string) => void; //  Callback to handle Error
    theme?: ITheme; // colors to theme the package
    [key: string]: any; // You can extend with any other configs
    wagmiConfig: Config
    stripeConfig: {
      publicKey: string;
      theme?: "light" | "dark";
    };
    mayanConfig: MayanConfigProps;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};

interface WrappedQueryComponentProps {
    children: ReactNode;
    queryClient?: QueryClient | undefined;
}

interface WrappedWagmiComponentProps {
  children: ReactNode;
  wagmiConfig: Config;
  wagmiProvider?: WagmiProviderProps | undefined;
}

const WrappedQueryComponent = ({ children, queryClient }: WrappedQueryComponentProps) => {
    // const { queryClient } = useConfig(); // Get the queryClient from config

    const [defaultQueryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: 1,
              retryDelay: 10000,
              structuralSharing,
            },
          },
        })
    );

    // Conditionally create a fallback QueryClient only if queryClient is not provided
    return queryClient ? (
        // If QueryClient exists in config, render children directly
        children
    ) : (
        // If no QueryClient in config, create a new QueryClient and provide it
        <QueryClientProvider
            client={defaultQueryClient}
        >
              {children}
        </QueryClientProvider>
    );
};

const WrappedWagmiProvider  = ({ children, wagmiProvider, wagmiConfig  }: WrappedWagmiComponentProps) => {
  // const { wagmiProvider, wagmiConfig } = useConfig(); // Get the queryClient from config

  // Conditionally create a fallback QueryClient only if queryClient is not provided
  return wagmiProvider ? (
      // If QueryClient exists in config, render children directly
      children
  ) : (
      // If no QueryClient in config, create a new QueryClient and provide it
      <WagmiProvider config={wagmiConfig}>
            {children}
        </WagmiProvider>
  );
};

interface ConfigProviderProps {
    config: ConfigContextType;
    children: ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
    config,
    children,
}) => {
    useEffect(() => {
        localStorage.setItem("u53r_71m3z0n3_iop", JSON.stringify(config.timezone));
        setAxiosInstance(config); // Set the Axios instance globally

        if (config?.errorHandler) {
            setGlobalErrorHandler(config.errorHandler);
        }

        applyTheme({ ...defaultTheme, ...(config?.theme || {}) });
    }, [config]);

    return (
        <ConfigContext.Provider value={config}>
          <WrappedQueryComponent queryClient={config.queryClient}>
             <WrappedWagmiProvider wagmiProvider={config.wagmiProvider} wagmiConfig={config.wagmiConfig}>
                {children}
              </WrappedWagmiProvider>
            </WrappedQueryComponent>
            <Toaster
                position="top-right"
                gutter={8}
                containerClassName="!pam-z-[999999]"
            />
        </ConfigContext.Provider>
    );
};

export { useConfig, ConfigProvider, ConfigContextType };

export default ConfigProvider;
