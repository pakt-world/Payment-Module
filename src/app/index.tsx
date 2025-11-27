/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRef } from "react";
import {
    wagmi,
    ConfigContextType,
    onResponseProps,
    PaymentSystemRef,
    PaymentData
} from "..";
import PaktPaymentModule from "../components";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../components/common";
import Logger from "../lib/logger";

const { connectors, chains, http, createConfig } = wagmi;

const { walletConnect } = connectors;
const { avalancheFuji } = chains;

const projectId = "810bdecb2f7f8d4bd3c732d2862df787";

const transports = {
    [avalancheFuji.id]: http(),
};

const wagmiConfig = createConfig({
    chains: [avalancheFuji],
    connectors: [
        walletConnect({
            projectId,
            customStoragePrefix: "pakt-",
        }),
    ],
    multiInjectedProviderDiscovery: true,
    transports,
    ssr: false,
    syncConnectedChain: true,
});

const App = () => {
    const paymentRef = useRef<PaymentSystemRef>(null);
    const paymentData: PaymentData = {
        amount: 1,
        coin: "usdc",
        description: "test",
        isSystemDeposit: true,
        chainId: "43113",
        name: "test"
    }

    const onSuccessResponse = (data: onResponseProps) => {
        // setIsLoading(true);
        Logger.debug(`on-finish-response--final---->`, { data });
        // setTimeout(()=>{
        //   setIsLoading(false)
        //   setOpenCryptoModal(false);
        // }, 20000);
    };

    const handleCryptoPayment = () => paymentRef.current?.startCryptoPayment?.(paymentData);

    const handleFiatPayment = () => paymentRef.current?.startFiatPayment?.(paymentData);

    const config: ConfigContextType = {
        theme: {
            brandPrimary: "rgba(255, 255, 255, 0.9)",
            brandSecondary: "rgba(255, 255, 255, 0.1)",
            headingText: "rgba(255, 255, 255, 0.95)",
            bodyText: "rgba(255, 255, 255, 0.7)",
            formBackground: "rgba(20, 20, 20, 0.6)",
            modalOverlay: "rgba(0, 0, 0, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            inputBackground: "rgba(0, 0, 0, 0.2)",
            inputBorder: "rgba(255, 255, 255, 0.1)",
            cardBackground: "rgba(255, 255, 255, 0.03)",
            tabBackground: "rgba(0, 0, 0, 0.2)",
            tabText: "rgba(255, 255, 255, 0.6)",
            tabActiveBackground: "rgba(255, 255, 255, 0.1)",
            tabActiveText: "#FFFFFF",
            errorText: "#ff6b6b",
        },
        cryptoConfig: {
            wagmiConfig,
        },
        stripeConfig: {
            publicKey: "",
            clientSecret: "",
            theme: "dark",
        },
        baseUrl: "https://api-devpaktbuild.chain.site/v1",
        // baseUrl: "http://localhost:9090/v1",
        verbose: true,
        clientId: "1234567890",
        clientSecret: "1234567890",

    };

    return (
        <div>
            <div className="circular-std-regular">
                <div className="pam:flex pam:h-screen pam:justify-center pam:items-center">
                    <div className="pam:flex pam:flex-col pam:border pam:rounded-2xl pam:w-[600px] pam:p-8 pam:gap-4 mx-auto my-auto">
                        <p className="pam:text-black pam:text-2xl pam:text-center">
                            Trigger Crypto Payment and Fiat Payments
                        </p>
                        <div className="pam:flex pam:flex-row pam:items-center pam:justify-center pam:gap-2 4">
                            <Button
                                variant="primary"
                                type="button"
                                onClick={handleCryptoPayment}
                            >
                                Pay with Crypto
                            </Button>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={handleFiatPayment}
                            >
                                Pay with Fiat
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <PaktPaymentModule
                ref={paymentRef}
                config={config}
                onPaymentSuccess={onSuccessResponse}
                onPaymentError={onSuccessResponse}
            />
        </div>
    );
};

export default App;
