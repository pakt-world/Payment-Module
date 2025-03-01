/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { wagmi, connectors, chains } from "../";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConfigProvider } from "context/config-context";
import MakeCryptoPaymentModal from "components/crypto-payment";
import "../styles/index.scss";
import { Button } from "components/common";
import { StripePaymentModal } from "components/fiat-payment";
import Logger from "lib/logger";
import { onFinishResponseProps } from "types";
import { getAxiosInstance } from "lib/axios-instance";

const { walletConnect } = connectors;
const { avalanche, avalancheFuji  } = chains;
const { http, createConfig } = wagmi;

interface MakePaymentResponse {
  address: string;
  amountToPay:number;
  chainId: string;
  coin: string;
  collectionAmount: number;
  collectionAmountCoin: number;
  expectedFee: number;
  feePercentage: number;
  rate: number;
  usdAmount: number;
  usdFee: number;
  contractAddress: string;
}

const App = () => {
    const [openCryptoModal, setOpenCryptoModal] = useState(false);
    const [openFiatModal, setOpenFiatModal] = useState(false);
    const [pKey, setPKey] = useState("");
    const projectId = "810bdecb2f7f8d4bd3c732d2862df787";
    
    const [payData, setPayData] = useState<MakePaymentResponse>({
      address: "0x90B780d7546ab754e35e0d2E80d76557A012D4fE",
      amountToPay: 0.323,
      chainId: "43113",
      coin: "USDC",
      collectionAmount: 10,
      collectionAmountCoin: 10,
      // contractAddress: "",
      contractAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
      expectedFee: 10,
      feePercentage: 10,
      rate: 12345,
      usdAmount: 500,
      usdFee: 10
    });
    
    const [token, setToken] = useState("");
    const [collectionId, setCollectionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const transports = {
      [avalanche.id]: http(),
      [avalancheFuji.id]: http(),
    };

    const wagmiConfig = createConfig({
      chains: [avalancheFuji],
      connectors: [walletConnect({ 
        projectId,
        customStoragePrefix:"pakt-"
      })],
      multiInjectedProviderDiscovery: true,
      transports,
      ssr:false,
      syncConnectedChain: true
    });

    const fetchCollectionData = async () => {
      const axios = getAxiosInstance();
      const respData = await axios.post("/payment",{coin: "USDC", collection: collectionId});
      const payD = respData.data?.data as MakePaymentResponse;
      setPayData({ ...payD });
      return respData;
    }

    const onSuccessResponse = (data: onFinishResponseProps) => {
      setIsLoading(true);
      Logger.debug(`on-finish-response---->`, { data });
      setTimeout(()=>{
        setIsLoading(false)
        setOpenCryptoModal(false);
      }, 20000);
    };

    const toggleModal = () => {
      if (!pKey){
        alert("please enter pKey");
        return false;
      }
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
                baseURL: "http://192.168.0.179:9090/v1",
                publicKey:
                    "nzTjIkbjIeb19Pm76bAeIrF2sdZRByLjkL8VSJbRrwg6dtUdNZ5ZeOFds9",
                clientId: "812773e0-6d93-4067-bb44-ad9eae2b0ba1",
                token,
                timezone: "America/New_York",
                wagmiConfig: wagmiConfig,
                theme:{
                  "primary": "#3055B3",
                  "primary-brighter": "#F4f4FD",
                  "primary-gradient": "linear-gradient(#010101, #010101)",
                  "btn-primary": "linear-gradient(#3055B3, #3055B3)",
                  "secondary": "#98dcfd",
                  "magnolia": "#f4f8ff",
                  "exhibit-tab-list": "#f4f8ff",
                  "modal-radius": "16px",
                  "modal-color": "linear-gradient(#010101, #010101)",
                  "modal-bd": "#3055B3"
                },
                stripeConfig: {
                  publicKey: pKey,
                  theme: "dark",
                }
            }}
        >
            <div className="pam-circular-std-regular">
              <div className="pam-flex pam-h-screen pam-justify-center pam-items-center">
                <div className="pam-flex pam-flex-col pam-border pam-rounded-2xl pam-w-[600px] pam-p-8 pam-mx-auto pam-my-auto pam-gap-4">
                  <p className="pam-text-black pam-text-2xl pam-text-center">Trigger Crypto Payment and Fiat Payments</p>
                  <div className="pam-flex pam-flex-row pam-items-center pam-justify-center pam-gap-2 pam-4">
                    <label>Enter Auth Token</label>
                    <input className="pam-w-full pam-p-2 pam-border pam-border-2 pam-border-grey" name="token" onChange={(e) =>setToken(e.target.value)} />
                  </div>
                  <div className="pam-flex pam-flex-row pam-items-center pam-justify-center pam-gap-2 pam-4">
                    <label>Enter Stripe Public Key</label>
                    <input className="pam-w-full pam-p-2 pam-border pam-border-2 pam-border-grey" name="pKey" onChange={(e)=>setPKey(e.target.value)} />
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
                            async () =>{
                              const ready = toggleModal();
                              if (ready) {
                                const sucDa = await fetchCollectionData();
                                if (sucDa){
                                  setOpenCryptoModal(true);
                                }
                              }
                            }
                          }
                      >
                          Pay with Crypto
                      </Button>
                      <Button 
                          className="pam-block pam-p-4 pam-bg-btn-primary"
                          type="button"
                          onClick={
                            async () =>{
                              const ready = toggleModal();
                              if (ready){
                                const sucDa = await fetchCollectionData();
                                if (sucDa){
                                  setOpenFiatModal(true)
                                }
                              }
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
              amount={payData.amountToPay}
              chainId={Number(payData.chainId)}
              coin={payData.coin}
              depositAddress={payData.address}
              tokenDecimal={6}
              contractAddress={payData.contractAddress}
              onSuccessResponse={onSuccessResponse}
              isLoading={isLoading}
            />
            <StripePaymentModal
              isOpen={openFiatModal}
              closeModal={()=>setOpenFiatModal(false)}
              collectionId={collectionId}
              chain="avalanche"
              onFinishResponse={onSuccessResponse}
              isLoading={isLoading}
            />
        </ConfigProvider>
    );
};

export default App;
