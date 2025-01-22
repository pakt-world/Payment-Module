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
import MakeCryptoPaymentModal from "components/crypto-payment";
import "../styles/index.scss";
import { Button } from "components/common";
import { StripePaymentModal } from "components/fiat-payment";

const App = () => {
    const [openCryptoModal, setOpenCryptoModal] = useState(false);
    const [openFiatModal, setOpenFiatModal] = useState(false);

    const [token, setToken] = useState("");
    const [collectionId, setCollectionId] = useState("");

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

    const toggleModal = () => {
      if (!token){
        alert("please enter token");
        return false;
      }
      if (!collectionId){
        alert("please enter collectionId");
        return false
      }
      return true;
    }

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
            <div className="pam-circular-std-regular">
              <div className="pam-flex pam-h-screen pam-justify-center pam-items-center">
                <div className="pam-flex pam-flex-col pam-border pam-rounded-2xl pam-w-[600px] pam-p-8 pam-mx-auto pam-my-auto pam-gap-4">
                  <p className="pam-text-black pam-text-2xl pam-text-center">Trigger Crypto Payment and Fiat Payments</p>
                  <div className="pam-flex pam-flex-row pam-items-center pam-justify-center pam-gap-2 pam-4">
                    <label>Enter Auth Token</label>
                    <input className="pam-w-full pam-p-2 pam-border pam-border-2 pam-border-grey" name="token" onChange={(e)=>setToken(e.target.value)} />
                  </div>
                  <div className="pam-flex pam-flex-row pam-items-center pam-justify-center pam-gap-2 pam-4">
                    <label>Enter Collection ID</label>
                    <input className="pam-w-full pam-p-2 pam-border pam-border-2 pam-border-grey" name="collection" onChange={(e)=>setCollectionId(e.target.value)} />
                  </div>
                  <div className="pam-flex pam-flex-row pam-items-center pam-justify-center pam-gap-2 pam-4">
                      <Button
                          className="pam-block pam-p-4 pam-bg-btn-primary"
                          type="button"
                          onClick={
                            () =>{
                              const ready = toggleModal();
                              if (ready) setOpenCryptoModal(true);
                            }
                          }
                      >
                          Pay with Crypto
                      </Button>
                      <Button 
                          className="pam-block pam-p-4 pam-bg-btn-primary"
                          type="button"
                          onClick={
                            () =>{
                              const ready = toggleModal();
                              if (ready) setOpenFiatModal(true)
                            }
                          }
                      >
                        Pay with Fiat
                      </Button>
                  </div>
                </div>
              </div>
            </div>
            <MakeCryptoPaymentModal 
              isOpen={openCryptoModal}
              closeModal={()=>setOpenCryptoModal(false)}
              collectionId={collectionId}
              amount={0.1}
              chainId={43113}
              coin="USDC"
              depositAddress="0x90B780d7546ab754e35e0d2E80d76557A012D4fE"
              tokenDecimal={6}
              contractAddress="0x5425890298aed601595a70AB815c96711a31Bc65"
            />
            <StripePaymentModal
              isOpen={openFiatModal}
              closeModal={()=>setOpenFiatModal(false)}
              collectionId={collectionId}
              amount={0.1}
              chain="avalanche"
              coin="USDC"
              depositAddress="0x90B780d7546ab754e35e0d2E80d76557A012D4fE"
              publicKey="pk_test_51Qi3BVCs2RllKa6DyEOk2iYwabhBeGdPa7jT6UC0VLkabSefxi7nLElGdZyao4pTnaMXwTNPvlNVBvnQUMucekwl00w5EIyAou"
              secretKey="cos_1QjzidCs2RllKa6DEwHRs8qk_secret_RoKMBXLpIk2g3mPPQGtkkAN9500X4hnXmCQ"
            />
        </ConfigProvider>
    );
};

export default App;
