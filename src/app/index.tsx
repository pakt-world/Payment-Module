/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRef } from "react";
import {
    wagmi,
    connectors,
    chains,
    ConfigContextType,
    onFinishResponseProps,
    PaymentSystemRef,
} from "..";
import PaktPaymentModule from "../components";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../components/common";
import Logger from "../lib/logger";

const { walletConnect } = connectors;
const { avalanche, avalancheFuji } = chains;
const { http, createConfig } = wagmi;

const projectId = "810bdecb2f7f8d4bd3c732d2862df787";

const transports = {
    [avalanche.id]: http(),
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
    // const [clientSecret, setClientSecret] = useState("");
    // const token = "1234567890";

    // const [payData, setPayData] = useState<MakePaymentResponse>({
    //     address: "0x90B780d7546ab754e35e0d2E80d76557A012D4fE",
    //     amountToPay: 0.323,
    //     chainId: "43113",
    //     coin: "USDC",
    //     collectionAmount: 10,
    //     collectionAmountCoin: 10,
    //     // contractAddress: "",
    //     contractAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
    //     expectedFee: 10,
    //     feePercentage: 10,
    //     rate: 12345,
    //     usdAmount: 500,
    //     usdFee: 10,
    // });

    // const axiosInstance = axios.create({
    //     baseURL: "http://localhost:9090/v1",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${token}`,
    //     },
    // });

    // const onStripPay = async () => {
    //     const respData = await axiosInstance.post(`/payment/stripe/initiate`, {
    //         collection: collectionId,
    //     });
    //     setClientSecret(respData.data?.data?.client_secret);
    //     return fetchCollectionData();
    // };

    const onSuccessResponse = (data: onFinishResponseProps) => {
        // setIsLoading(true);
        Logger.debug(`on-finish-response--final---->`, { data });
        // setTimeout(()=>{
        //   setIsLoading(false)
        //   setOpenCryptoModal(false);
        // }, 20000);
    };

    const handleCryptoPayment = () => {
        console.log("handleCryptoPayment");
        paymentRef.current?.startCryptoPayment?.({
            amount: 1,
            coin: "usdc",
            description: "test",
            isDirect: true,
            collectionType: "tip",
            owner: "67d05d221a22ed512faabed0",
            name: "test",
        });
    };

    const handleFiatPayment = () =>
        paymentRef.current?.startFiatPayment?.({
            amount: 1,
            coin: "usdc",
            description: "test",
            isDirect: false,
            collectionType: "tip",
            owner: "67d05d221a22ed512faabed0",
            name: "test",
        });

    const config: ConfigContextType = {
        cryptoConfig: {
            wagmiConfig,
        },
        stripeConfig: {
            publicKey:
                "pk_test_51N00000000000000000000000000000000000000000000000000000000000000000000000000000000",
            clientSecret:
                "sk_test_51N00000000000000000000000000000000000000000000000000000000000000000000000000000000",
            theme: "dark",
        },
        paktConfig: {
            baseUrl: "http://localhost:9090/v1",
            verbose: true,
        },
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
                                className="pam:block pam:p-4 pam:bg-primary"
                                variant="primary"
                                type="button"
                                onClick={handleCryptoPayment}
                            >
                                Pay with Crypto
                            </Button>
                            <Button
                                className="pam:block pam:p-4 pam:bg-primary"
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
                isLoading={false}
            />
        </div>
    );
};

export default App;
