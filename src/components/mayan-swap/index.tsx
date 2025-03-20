
import { ArrowDown, Loader2, XCircleIcon } from "lucide-react";
import { Button, Spinner } from "../common";
import { Option, SwapWidgetFlow, VIEW_STEP } from "./types";
import MayanSwapHeader from "./header";
import avalancheIcon from "../../assets/images/avalanche.png"
import usdcIcon from "../../assets/images/usdc.png"
import useMayanSwapAction from "./actions";
import { SwapStepOneProp, SwapStepTwoProp } from "../../types";
import { SolanaWalletProvider } from "context/solana-provider";
import WalletConnectorList from "./components/wallet-list";
import RenderConnectBtn from "./components/connect-btn";
import WrapperSelect from "./components/select";
import { useConfig } from "context/config-context";


// Step One
const StepOne = ({ networksPayload, tokensPayload, swapPayload, goToNext }:SwapStepOneProp) => {
  return (
    <div className="pam-flex pam-flex-col pam-justify-center pam-gap-2">
      <div className="pam-flex pam-flex-col pam-gap-2">
        <WrapperSelect
          label="Network"
          options={networksPayload?.optionMapped || []}
          value={networksPayload.selectedOption || {} as Option}
          onChange={networksPayload.selectOption}
          showBreakLine={false}
          loading={networksPayload.loading}
        />
        <WrapperSelect 
          label="Token"
          options={tokensPayload.optionMapped || []}
          value={tokensPayload.selectedOption as Option}
          onChange={tokensPayload.selectOption}
          showBreakLine={true}
          loading={tokensPayload.loading}
        />
      </div>

      <div className="pam-flex pam-flex-col pam-min-h-[200px] pam-items-center pam-justify-center pam-gap-2">
        {swapPayload &&
          <>
            {(!swapPayload.loading && swapPayload.currentQuote) ? 
              <>
                <div className="pam-p-1 pam-rounded-full pam-bg-[#F7F9FA] pam-border pam-border-[#CDCFD0] pam-w-fit pam-mb-2">
                  <ArrowDown size={18} color="#999"/>
                </div>

                <div className="pam-flex pam-flex-col pam-w-full pam-items-center pam-justify-center">
                  <div className="pam-flex pam-flex-col pam-border-[1.5px] pam-border-[#23C16B] pam-p-4 pam-bg-[#ECFCE5] pam-rounded-2xl pam-gap-2 pam-w-full">
                    <div className="pam-flex pam-flex-row pam-gap-2 pam-justify-between pam-text-base pam-items-center pam-justify-center">
                      <div className="pam-flex pam-flex-row pam-border-[1px] pam-border-[#E8E8E8] pam-bg-[#F9F9F9] pam-rounded-full pam-p-1 pam-gap-1 pam-items-center">
                        <img width={24} height={24} src={usdcIcon} />
                        <span>{swapPayload.currentQuote?.toToken.symbol}</span>
                      </div>
                      <div className="pam-flex pam-flex-row pam-gap-2 pam-items-center">
                        <span className="pam-text-[12px]">ON</span>
                        <div className="pam-flex pam-flex-row pam-border pam-border-[#E8E8E8] pam-bg-[#F9F9F9] pam-rounded-full pam-p-1 pam-gap-1 pam-items-center">
                          <img width={24} height={24} src={avalancheIcon} />
                          <span>Avalanche C-Chain</span>
                        </div>
                      </div>
                    </div>
                    <div className="pam-flex pam-flex-row pam-gap-4 pam-items-center pam-font-400">
                      <span className="pam-text-black pam-text-[24px]">{swapPayload.currentQuote?.minAmountOut}</span><span className="pam-text-[#6C757D] pam-font-100 pam-text-[16px]"> = ${(Number(swapPayload.currentQuote?.minAmountOut || "0") * swapPayload.coinOutPriceUsd).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pam-flex pam-flex-row pam-border-[1.5px] pam-border-[#AED2BC] pam-p-4 pam-bg-[#FCFCFD] pam-rounded-2xl pam-items-center pam-justify-between pam-gap-2 pam-w-full pam-font-400">
                    <div className="pam-text-base pam-text-black">
                      1 {swapPayload.currentQuote?.fromToken.symbol} = {swapPayload.currentQuote?.price.toFixed(6)} {swapPayload.currentQuote?.toToken.symbol}
                    </div>
                    <div className="pam-text-base pam-text-body">
                      ETA: {swapPayload.currentQuote?.clientEta}
                    </div>
                </div>
              </>
            : swapPayload.quoteError ? 
              <div className="pam-flex pam-flex-col pam-w-full pam-items-center pam-justify-center pam-text-tbody pam-gap-2">
                <XCircleIcon size={30} />
                <p>No Swap Route Found...</p>
              </div>
            :
              <Loader2 className="pam-animate-spin pam-text-primary" size={35}  />
            }
          </>
        }
      </div>
      
      <div className="pam-mt-auto pam-w-full">
        <Button
            disabled={!swapPayload?.ready || swapPayload.loading}
            onClick={goToNext}
            fullWidth
            variant="primary"
            size="md"
        >
            <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
                {(swapPayload?.ready && swapPayload?.loading) ? 
                  <Spinner />: <span>Continue</span>
                }
            </div>
        </Button>
      </div>
    </div>
  )
}

// Step Two
const StepTwo = ({ selectedNetwork, destinationAddress, quote  }:SwapStepTwoProp) => {
 if (selectedNetwork && quote && destinationAddress){
  return(
    <>
      <p className="pam-text-tbody">Choose wallet to make payment from</p>
      <WalletConnectorList 
        chainType={selectedNetwork.mode}
        chainId={selectedNetwork.chainId}
      />
     <RenderConnectBtn 
        chainType={selectedNetwork.mode}
        destinationAddress={destinationAddress}
        quote={quote}
        chainId={selectedNetwork.chainId}
      />
    </>
  )}
  return <p className="pam-text-lg pam-text-tbody">No Quote Found!!!</p>
};

// main Form
const MayanSwapForm = ({ isLoading, amount, destinationAddress, destinationChain, destinationToken, onSuccessResponse, goBack, closeModal }: SwapWidgetFlow) => {
  // widget action hook
  const { loading, networksPayload, selectedNetwork, tokensPayload, swapPayload, step, goToNext, goToPrev } = useMayanSwapAction({
    amount,
    destinationAddress,
    isLoading,
    onSuccessResponse,
    goBack,
    destinationChain,
    destinationToken
  });

  console.log("swapping--", networksPayload, swapPayload, selectedNetwork);

  return (
      <div className="pam-font-sans pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-2 pam-p-6 pam-bg-[#FCFCFD] pam-rounded-2xl pam-border pam-min-h-[500px] pam-w-[448px]">
        <MayanSwapHeader closeModal={closeModal} step={step} goBack={goToPrev} />
        {step == VIEW_STEP.ONE ?
          <StepOne 
            networksPayload={networksPayload}
            tokensPayload={tokensPayload}
            swapPayload={swapPayload}
            connecting={loading}
            goToNext={goToNext}
          /> :
          <StepTwo 
            selectedNetwork={selectedNetwork}
            destinationAddress={destinationAddress}
            quote={swapPayload?.currentQuote}
          />
        }
      </div>
  );
};

// Wrapped with provider
const MayanSwapWidget = ({ isLoading, amount, destinationAddress, destinationChain, destinationToken, onSuccessResponse, goBack, closeModal }: SwapWidgetFlow) =>{
  const { mayanConfig } = useConfig();
  return (
  <SolanaWalletProvider config={{ endpoint: mayanConfig.endpoint }}>
    <MayanSwapForm 
      isLoading={isLoading}
      amount={amount}
      onSuccessResponse={onSuccessResponse}
      goBack={goBack}
      destinationAddress={destinationAddress}
      closeModal={closeModal}
      destinationChain={destinationChain}
      destinationToken={destinationToken}
    />
  </SolanaWalletProvider>
)};

export default MayanSwapWidget;
