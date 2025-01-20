/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { http, createConfig } from "wagmi";
import { avalanche, avalancheFuji, base, baseGoerli } from "@wagmi/core/chains";
import { walletConnect } from "wagmi/connectors";


/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ConfigProvider } from "context/config-context";
import "../styles/index.scss";
import MakeCryptoPaymentModal from "components/crypto-payment";

const App = () => {
    const [openCryptoModal, setOpenCryptoModal] = useState(false);
    const [openFiatModal, setOpenFiatModal] = useState(false);

    const [token, setToken] = useState(() =>localStorage.getItem("token") || "");

    const transports = {
      [avalanche.id]: http(),
      [avalancheFuji.id]: http(),
      [base.id]: http(),
      [baseGoerli.id]: http(),
    };

    const wagmiConfig = createConfig({
      chains: [avalancheFuji, avalanche, base, baseGoerli],
      connectors: [walletConnect({ projectId: "" })],
      multiInjectedProviderDiscovery: true,
      transports,
    });

    return (
        <ConfigProvider
            config={{
                baseURL: "https://api-devavabuild.chain.site/v1",
                publicKey:
                    "nzTjIkbjIeb19Pm76bAeIrF2sdZRByLjkL8VSJbRrwg6dtUdNZ5ZeOFds9",
                clientId: "812773e0-6d93-4067-bb44-ad9eae2b0ba1",
                token,
                timezone: "America/New_York",
                wagmiConfig: wagmiConfig,
            }}

        >
            <div className="circular-std-regular">
                <div className="ir-flex ir-flex-col ir-items-start ir-gap-2">
                    <button
                        className="ir-block"
                        type="button"
                        onClick={() => setOpenCryptoModal(true)}
                    >
                        Pay with Cryto
                    </button>

                    <button
                        className="ir-block"
                        type="button"
                        onClick={() =>setOpenFiatModal(true)}
                    >
                      Pay with Fiat
                    </button>

                    {/* <MakeCryptoPaymentModal 
                      amount={1000}
                      chainId={43113}
                      closeModal={()=>setOpenCryptoModal(false)}
                      coin="USDC"
                      depositAddress="0x90B780d7546ab754e35e0d2E80d76557A012D4fE"
                      tokenDecimal={6}
                      contractAddress="0x5425890298aed601595a70AB815c96711a31Bc65"
                    /> */}
                </div>


            </div>
        </ConfigProvider>
    );
};

export default App;
