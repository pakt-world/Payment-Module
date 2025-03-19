
import { ArrowDown, Loader2 } from "lucide-react";
import { Button, Spinner } from "../../components/common";
import {  APIChainsResponse, APITokensResponse, MayanWidgetProps, Option, OptionDataResponse, SetReadyProps, SwapDataResponse } from "./types";
import { SelectDropdown } from "../../components/common/select";
import MayanSwapHeader from "./header";
import { sentenceCase } from "../../utils";
import avalancheIcon from "../../assets/images/avalanche.png"
import usdcIcon from "../../assets/images/usdc.png"
import useMayanSwapAction from "./actions";
import { onFinishResponseProps } from "../../types";
import { SolanaWalletProvider } from "context/solana-provider";

interface SwapWidgetFlow {
  collectionId: string;
  isOpen: boolean;
  isLoading:boolean;
  amount: number;
  closeModal: ()=>void;
  onSuccessResponse: (data:onFinishResponseProps) => void;
}

const RenderOptionView = ({ value }: { value: Option}) => {
  return (
    <div className="pam-font-400 pam-flex pam-gap-4 pam-text-black pam-text-base pam-w-full pam-justify-between">
      <div className="pam-flex pam-flex-row pam-text-sm pam-gap-2 pam-items-center pam-justify-center ">
        {value?.meta?.icon && <div className="pam-flex pam-bg-grey pam-rounded-xl">
          <img width={24} height={24} src={value?.meta?.icon}/>
        </div>}
        <span>{sentenceCase(value.label)}</span>
        {value?.meta?.symbol && <span className="pam-text-sm pam-text-[#00000080] pam-opacity-50">{value?.meta?.symbol}</span>}
      </div>
      {(value?.meta?.amount && value?.meta?.usd) && <div className="pam-flex pam-flex-col pam-text-sm pam-justify-end pam-items-end pam-text-[#00000080]">
        <span>{value?.meta?.amount}</span>
        <span className="pam-opacity-50">${value?.meta?.usd}</span>
      </div>}
    </div>
  )
}

const WrapperSelect = ({ label, value, options, showBreakLine, onChange, disabled, loading }: { label: string, value: Option, showBreakLine:boolean, options: Option[], disabled?:boolean, loading: boolean, onChange: (value:Option)=>void}) => {
  return(
    <div className="pam-flex-col pam-gap-2">
      <p className="pam-font-400 pam-text-base pam-text-[#999999]">{label}</p>
      <SelectDropdown 
          options={options}
          value={value}
          onChange={(value)=>onChange(value)}
          placeholder={label}
          disabled={disabled || loading}
          className="sm:pam-w-full"
          triggerClassName="pam-h-12 pam-w-full sm:pam-text-base pam-text-[#999999]"
          dropdownClassName="pam-gap-2"
          showBreakLine={showBreakLine}
          RenderView={RenderOptionView}
          loading={loading}
      />
    </div>
  )
}

const MayanSwapForm = ({ collectionId, isOpen, isLoading, amount, onSuccessResponse, closeModal }: SwapWidgetFlow) => {
  // widget action hook
  const { loading, mayanConfig, networksPayload, tokensPayload, swapPayload, Connect, connecting } = useMayanSwapAction({
    collectionId,
    isOpen,
    amount,
    isLoading,
    closeModal,
    onSuccessResponse,
   });

  return (
      <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-2 pam-p-6 pam-bg-[#FCFCFD] pam-rounded-2xl pam-border pam-min-h-[500px]">
        <MayanSwapHeader closeModal={closeModal}/>
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
                {swapPayload.loading ? 
                  <Loader2 className="pam-animate-spin pam-text-primary" size={35}  />
                :
                  <>
                    <div className="pam-p-1 pam-rounded-full pam-bg-[#F7F9FA] pam-border pam-border-[#CDCFD0] pam-w-fit pam-mb-2">
                      <ArrowDown size={18} color="#000"/>
                    </div>

                    <div className="pam-flex pam-flex-col pam-w-full pam-items-center pam-justify-center">
                      <div className="pam-flex pam-flex-col pam-border-[1.5px] pam-border-[#23C16B] pam-p-2 pam-bg-[#ECFCE5] pam-rounded-2xl pam-gap-2 pam-w-full">
                        <div className="pam-flex pam-flex-row pam-gap-2 pam-justify-between pam-text-base pam-items-center pam-justify-center">
                          <div className="pam-flex pam-flex-row pam-border-[1px] pam-border-[#E8E8E8] pam-bg-[#F9F9F9] pam-rounded-full pam-p-1 pam-gap-1 pam-items-center">
                            <img width={24} height={24} src={swapPayload.currentQuote?.toToken.logoURI} />
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

                    <div className="pam-flex pam-flex-row pam-border-[1.5px] pam-border-[#AED2BC] pam-p-2 pam-bg-[#FCFCFD] pam-rounded-2xl pam-items-center pam-justify-between pam-gap-2 pam-w-full pam-font-400">
                        <div className="pam-text-base pam-text-black">
                          1 {swapPayload.currentQuote?.fromToken.symbol} = {swapPayload.currentQuote?.price.toFixed(6)} {swapPayload.currentQuote?.toToken.symbol}
                        </div>
                        <div className="pam-text-base pam-text-[#6C757D]">
                          ETA: {swapPayload.currentQuote?.clientEta}
                        </div>
                    </div>
                  </>
                }
              </>
            }
          </div>
          
          <div className="pam-mt-auto pam-w-full">
            <Button
                disabled={!swapPayload?.ready || swapPayload.loading || isLoading || connecting}
                onClick={Connect}
                fullWidth
                variant="primary"
                size="md"
            >
                <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
                    {(swapPayload?.ready && swapPayload?.loading) || connecting ? 
                      <Spinner />: <span>Connect Wallet</span>
                    }
                </div>
            </Button>
          </div>
        </div>
      </div>
  );
};

const MayanSwapWidget = ({ collectionId, isOpen, isLoading, amount, onSuccessResponse, closeModal }: SwapWidgetFlow) => {
  return (
    <SolanaWalletProvider>
      <MayanSwapForm 
        collectionId={collectionId}
        isOpen={isOpen}
        isLoading={isLoading}
        amount={amount}
        onSuccessResponse={onSuccessResponse}
        closeModal={closeModal}
      />
    </SolanaWalletProvider>
  )
};

export default MayanSwapWidget;
