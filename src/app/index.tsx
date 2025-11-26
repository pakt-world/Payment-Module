/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import {
    wagmi,
    ConfigContextType,
    onResponseProps,
    PaymentData,
    PaktPaymentProvider,
    usePaktPayment,
} from "..";

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

const AppContent = () => {
    const { startCryptoPayment, startFiatPayment, loading, error } =
        usePaktPayment();

    const paymentData: PaymentData = {
        amount: 1,
        coin: "usdc",
        description: "test",
        isSystemDeposit: true,
        chainId: "43113",
        name: "test",
    };

    const handleCryptoPayment = () => {
        startCryptoPayment(paymentData);
    };

    const handleFiatPayment = () => {
        startFiatPayment(paymentData);
    };

    return (
        <div className="circular-std-regular">
            <div className="pam:flex pam:h-screen pam:justify-center pam:items-center">
                <div className="pam:flex pam:flex-col pam:border pam:rounded-2xl pam:w-[600px] pam:p-8 pam:gap-4 mx-auto my-auto">
                    <p className="pam:text-black pam:text-2xl pam:text-center">
                        Trigger Crypto Payment and Fiat Payments
                    </p>
                    {error && (
                        <div className="pam:mb-4 pam:rounded-lg pam:bg-red-500/20 pam:border pam:border-red-500 pam:p-4">
                            <p className="pam:text-red-200">{error}</p>
                        </div>
                    )}
                    {loading && (
                        <div className="pam:mb-4 pam:text-center pam:text-gray-500">
                            Processing payment...
                        </div>
                    )}
                    <div className="pam:flex pam:flex-row pam:items-center pam:justify-center pam:gap-2 4">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleCryptoPayment}
                            disabled={loading}
                        >
                            Pay with Crypto
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleFiatPayment}
                            disabled={loading}
                        >
                            Pay with Fiat
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const onSuccessResponse = (data: onResponseProps) => {
        Logger.debug(`on-finish-response--final---->`, { data });
    };

    const config: ConfigContextType = {
        theme: {
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
        <PaktPaymentProvider
            config={config}
            onPaymentSuccess={onSuccessResponse}
            onPaymentError={onSuccessResponse}
        >
            <AppContent />
        </PaktPaymentProvider>
    );
};

export default App;
