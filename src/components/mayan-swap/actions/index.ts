import { useMemo, useState } from 'react';
import { useConfig } from "../../../context/config-context";
import { APIChainsResponse, APITokensResponse, ConnectorProps, MayanConfigProps, MayanSwapActionProps, MayanSwapModalProps, MayanWidgetProps, Option, OptionDataResponse, SetReadyProps, SwapDataResponse, VIEW_STEP } from "../types";
import { useGetMayanChains, useGetMayanCoins, useGetTokenPrice } from './api';
import useMayanCalculateSwap from './swap';
import usdcIcon from '../../../assets/images/usdc.png';
import avalancheIcon from '../../../assets/images/avalanche.png';

interface mayanSwapActions {
  mayanConfig: MayanConfigProps;
  loading: boolean;
  networksPayload: OptionDataResponse<APIChainsResponse>;
  tokensPayload: OptionDataResponse<APITokensResponse>;
  swapPayload?: SwapDataResponse;
  selectedNetwork?: { mode:string, chainId:number} | null;
  step: VIEW_STEP;
  goToNext: () => void;
  goToPrev: () => void;
}

const useMayanSwapAction  = ({ amount, destinationAddress, destinationToken:dT, destinationChain, goBack, onSuccessResponse }: MayanSwapActionProps ):mayanSwapActions => {  
  const { mayanConfig } = useConfig();

  // TODO:: make dynamic
  const destinationToken = { id: "USDC", value:"usd-coin", logoUrl: usdcIcon, contract: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e" };
  const destinationNetwork = { id:"avalanche", logoUrl: avalancheIcon };

  const [selectedNetwork, setSelectedNetwork] = useState<APIChainsResponse| null>(null);
  const [selectedToken, setSelectedToken] = useState<APITokensResponse| null>(null);
  const [step, setStep] = useState<VIEW_STEP>(VIEW_STEP.ONE);
  const { data:chainData, error:chainError, isFetching:chainIsFetching, isLoading:chainLoading } = useGetMayanChains();
  const { data:tokenData, error:tokenError, isFetching: tokenIsFetching, isLoading: tokenLoading, refetch: fetchTokens } = useGetMayanCoins(selectedNetwork?.nameId);

  const { currentQuote, allQuotes, quoteLoading, quoteReady, coinOutPriceUsd, calculateRate, resetQuote, quoteError } = useMayanCalculateSwap({ amount, selectedNetworkType: selectedNetwork?.mode || "EVM", destinationAddress, onSuccessResponse });

  const SetNetwork = async (v:Option) => {
    const selectedN = (chainData || []).find(n=>n.nameId == v.value);
    if (!selectedN) return;
    setSelectedNetwork(selectedN);
    setSelectedToken(null);
    resetQuote();
    return fetchTokens({
      throwOnError: true,
      cancelRefetch: true,
    });
  }

  const SetToken = async (v:Option) => {
    if (!selectedNetwork) return;
    const selectedN = (tokenData || []).find(n=>n.coingeckoId == v.value);
    if (!selectedN) return;
    setSelectedToken(selectedN);
    resetQuote();
    return calculateRate({
      fromChain: selectedNetwork?.nameId,
      toChain: destinationNetwork.id,
      fromToken: selectedN.contract,
      toToken: destinationToken.contract,
      fromPriceId: selectedN.coingeckoId,
    });
  }

  const networksPayload:OptionDataResponse<APIChainsResponse> = useMemo(()=>{
    const allChains = chainData?.filter(f=>f.nameId !== destinationNetwork.id && ["EVM", "SOLANA"].includes(f.mode));
    return({
      loading: chainIsFetching || chainLoading,
      data: allChains,
      error: chainError?.message,
      optionMapped: (allChains || []).map(r=>({ label: r.nameId, value: r.nameId, meta:{ icon: r.logoURI, disabled: r.nameId == selectedNetwork?.nameId } })),
      selectedOption: selectedNetwork ? { label:selectedNetwork?.nameId, value: selectedNetwork?.nameId, meta:{ icon: selectedNetwork?.logoURI }} : null,
      selectOption: SetNetwork
    })
  },[chainData, chainIsFetching, chainLoading, selectedNetwork, SetNetwork]);

  const tokensPayload:OptionDataResponse<APITokensResponse> = useMemo(()=>{
    const allTokens = selectedNetwork?.nameId === destinationNetwork.id ? tokenData?.filter(f=>f.coingeckoId !== destinationToken.value): tokenData;
    return ({
      loading: tokenIsFetching || tokenLoading,
      data: tokenData,
      error: tokenError?.message,
      optionMapped: (allTokens || []).map(r=>({ label: r.name, value: r.coingeckoId, meta:{ icon: r.logoURI, symbol: r.symbol } })),
      selectedOption: selectedToken ? { label:selectedToken.name, value: selectedToken.coingeckoId, meta:{ 
        icon: selectedToken.logoURI, 
        symbol: selectedToken.symbol,
        usd: (currentQuote && coinOutPriceUsd) ? String((Number(currentQuote?.minAmountOut || "0") * coinOutPriceUsd).toFixed(2)) : undefined, 
        amount: currentQuote ? String(currentQuote.effectiveAmountIn) : undefined
      }} : null,
      selectOption: SetToken
    })
  },[tokenData, tokenIsFetching, tokenLoading, selectedToken, SetToken, currentQuote ]);


  const swapPayload: SwapDataResponse | undefined = useMemo(()=>{
    if (!selectedNetwork)return undefined;
    if (!selectedToken) return undefined;
    return {
      ready: quoteReady,
      loading: quoteLoading,
      currentQuote,
      allQuotes,
      coinOutPriceUsd: coinOutPriceUsd || 0,
      quoteError,
    };
  },[calculateRate, currentQuote, allQuotes, quoteError]);

  console.log("token-ddd", tokensPayload, selectedNetwork, selectedToken)
  console.log("quote===", currentQuote, allQuotes, swapPayload)

  const goToNext = () => {
    if (step == VIEW_STEP.ONE) setStep(VIEW_STEP.TWO);
    else return null;
  }

  const goToPrev = () => {
    if (step === VIEW_STEP.TWO){
      setStep(VIEW_STEP.ONE);
    } else return goBack && goBack();
  }

  return {
    mayanConfig,
    loading: false,
    networksPayload,
    tokensPayload,
    swapPayload,
    step,
    selectedNetwork: selectedNetwork ? {mode:selectedNetwork?.mode, chainId: Number(selectedNetwork?.chainId)} : null,
    goToNext,
    goToPrev,
  };
}

export default useMayanSwapAction;
