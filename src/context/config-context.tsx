/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config, type WagmiProviderProps } from "wagmi";
import { structuralSharing } from '@wagmi/core/query';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { setGlobalErrorHandler } from "../lib/error-handler";
import { applyTheme } from "../utils";
import defaultTheme from "../styles/default-theme";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/index.scss";
import { ConfigContextType } from "../types";


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
        if (config?.errorHandler) {
            setGlobalErrorHandler(config.errorHandler);
        }

        applyTheme({ ...defaultTheme, ...(config?.theme || {}) });
    }, [config]);

    return (
        <ConfigContext.Provider value={config}>
          <WrappedQueryComponent queryClient={config.cryptoConfig?.queryClient}>
            <WrappedWagmiProvider wagmiProvider={config.cryptoConfig?.wagmiProvider} wagmiConfig={config.cryptoConfig?.wagmiConfig as Config}>
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

export { 
    useConfig,
    ConfigProvider,
};
