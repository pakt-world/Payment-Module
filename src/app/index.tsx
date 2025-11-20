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
        theme:{
            brandPrimary: "#007C5B",
            brandSecondary: "#ecfce5",
            headingText: "#1F2739",
            bodyText: "#6C757D",
        },
        cryptoConfig: {
            wagmiConfig,
        },
        stripeConfig: {
            publicKey: "",
            clientSecret: "",
            theme: "dark",
        },
        baseUrl: "http://localhost:9090/v1",
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
