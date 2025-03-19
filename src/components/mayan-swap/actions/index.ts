import { useMemo, useState } from 'react';
import { useConfig } from "../../../context/config-context";
import { APIChainsResponse, APITokensResponse, MayanConfigProps, MayanSwapModalProps, MayanWidgetProps, Option, OptionDataResponse, SetReadyProps, SwapDataResponse } from "../types";
import { useGetMayanChains, useGetMayanCoins, useGetTokenPrice } from './api';
import useMayanCalculateSwap from './swap';
import usdcIcon from '../../../assets/images/usdc.png';
import avalancheIcon from '../../../assets/images/avalanche.png';
import useSolana from './solana';

interface mayanSwapActions {
  mayanConfig: MayanConfigProps;
  loading: boolean;
  networksPayload: OptionDataResponse<APIChainsResponse>;
  tokensPayload: OptionDataResponse<APITokensResponse>;
  swapPayload?: SwapDataResponse;
  Connect: () => void;
  connecting:boolean;
  connected:boolean;
}

const useMayanSwapAction  = ({ isOpen, isLoading, amount }: MayanSwapModalProps ):mayanSwapActions => {  
  const { mayanConfig } = useConfig();

  // TODO:: make dynamic
  const destinationToken = { id: "USDC", value:"usd-coin", logoUrl: usdcIcon, contract: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e" };
  const destinationNetwork = { id:"avalanche", logoUrl: avalancheIcon };

  const [selectedNetwork, setSelectedNetwork] = useState<APIChainsResponse| null>(null);
  const [selectedToken, setSelectedToken] = useState<APITokensResponse| null>(null);
  const { data:chainData, error:chainError, isFetching:chainIsFetching, isLoading:chainLoading } = useGetMayanChains();
  const { data:tokenData, error:tokenError, isFetching: tokenIsFetching, isLoading: tokenLoading, refetch: fetchTokens } = useGetMayanCoins(selectedNetwork?.nameId);

  const { calculateRate, currentQuote, allQuotes, quoteLoading, quoteReady, coinOutPriceUsd } = useMayanCalculateSwap({ amount });
  const solana = useSolana();

  const SetNetwork = async (v:Option) => {
    const selectedN = (chainData || []).find(n=>n.nameId == v.value);
    if (!selectedN) return;
    setSelectedNetwork(selectedN);
    setSelectedToken(null);
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
    console.log("get-quote", selectedN);
    return calculateRate({
      fromChain: selectedNetwork?.nameId,
      toChain: destinationNetwork.id,
      fromToken: selectedN.contract,
      toToken: destinationToken.contract,
    });
  }

  const networks:APIChainsResponse[] | [] = useMemo(()=>{
    return chainData || [];
  },[chainData]);

  const networksPayload:OptionDataResponse<APIChainsResponse> = useMemo(()=>{
    return({
      loading: chainIsFetching || chainLoading,
      data: networks,
      error: chainError?.message,
      optionMapped: networks.map(r=>({ label: r.nameId, value: r.nameId, meta:{ icon: r.logoURI } })),
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

  console.log("token-ddd", tokensPayload, currentQuote)

  const swapPayload: SwapDataResponse | undefined = useMemo(()=>{
    if (!selectedNetwork)return undefined;
    if (!selectedToken) return undefined;
    return ({
      ready: quoteReady,
      loading: quoteLoading,
      currentQuote,
      allQuotes,
      coinOutPriceUsd: coinOutPriceUsd || 0,
    });
  },[calculateRate, currentQuote, allQuotes]);

  const Connect = () => {
    console.log("connecting---", selectedNetwork?.chainName);
    if (!selectedNetwork) throw Error("No Network selected");
    // if (selectedNetwork?.chainName.toLowerCase() === "solana") return solana.connect();
    console.log("connected", solana.connected, solana.isConnecting);
  }

  return {
    mayanConfig,
    loading: false,
    networksPayload,
    tokensPayload,
    swapPayload,
    Connect,
    connecting: solana.isConnecting,
    connected: solana.connected,
  }
}

export default useMayanSwapAction;
