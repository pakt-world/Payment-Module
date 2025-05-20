/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { wagmi, connectors, chains, ConfigContextType, CryptoPaymentModal, FiatPaymentModal } from "../";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "../styles/index.scss";
import { Button } from "../components/common";
import Logger from "../lib/logger";
import { onFinishResponseProps } from "../types";
import axios from "axios";

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
      customStoragePrefix:"pakt-"
    }),
  ],
  multiInjectedProviderDiscovery: true,
  transports,
  ssr:false,
  syncConnectedChain: true
});

const App = () => {
    const [openCryptoModal, setOpenCryptoModal] = useState(false);
    const [openFiatModal, setOpenFiatModal] = useState(false);
    const [pKey, setPKey] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    
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
    
    const axiosInstance = axios.create({
      baseURL: "http://localhost:9090/v1",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });


    const fetchCollectionData = async () => {
      const respData = await axiosInstance.post(`/payment`, { 
        coin: "USDC", collection: collectionId
      });
      const payD = respData.data?.data as MakePaymentResponse;
      setPayData({ ...payD });
      return respData;
    }

    const onStripPay = async () => {
      const respData = await axiosInstance.post(`/payment/stripe/initiate`, {
        collection: collectionId
      });
      console.log("respData", respData);
      setClientSecret(respData.data?.data?.client_secret);
      return await fetchCollectionData();
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

    const config: ConfigContextType = {
      cryptoConfig: {
        wagmiConfig: wagmiConfig,
        theme: "dark",
        publicKey: "nzTjIkbjIeb19Pm76bAeIrF2sdZRByLjkL8VSJbRrwg6dtUdNZ5ZeOFds9",
      },
      stripeConfig: {
        publicKey: pKey,
        clientSecret: clientSecret,
        theme: "dark",
      }
    };

    return (
        <div>
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
                                const sucDa = await onStripPay();
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
            <CryptoPaymentModal 
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
              config={config}
            />
            <FiatPaymentModal
              config={config}
              collectionId={collectionId}
              isOpen={openFiatModal}
              chain="avalanche"
              isLoading={isLoading}
              closeModal={()=>setOpenFiatModal(false)}
              onFinishResponse={onSuccessResponse}
            />
        </div>
    );
};

export default App;
