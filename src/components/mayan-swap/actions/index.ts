
import { fetchQuote, swapFromEvm, swapFromSolana, Quote } from '@mayanfinance/swap-sdk'

import { useConfig } from "context/config-context";
import { APIChainsResponse, APITokensResponse, MayanConfigProps, MayanSwapModalProps, MayanWidgetProps, Option, OptionDataResponse, SetReadyProps, SwapDataResponse } from "../types";
import { useGetMayanChains, useGetMayanCoins } from './api';
import { useMemo, useState } from 'react';
import useMayanCalculateSwap from './swap';

interface mayanSwapActions {
  mayanConfig: MayanConfigProps;
  loading: boolean;
  networksPayload: OptionDataResponse<APIChainsResponse>;
  tokensPayload: OptionDataResponse<APITokensResponse>;
  swapPayload?: SwapDataResponse;
  btnLoading: boolean;
  btnReady: boolean;
}

const useMayanSwapAction  = ({ isOpen, isLoading, amount, coin, rpcs, sourceChains, destinationChains, tokensFrom, tokensTo }: MayanSwapModalProps ):mayanSwapActions => {  
  const { mayanConfig } = useConfig();
  const [selectedNetwork, setSelectedNetwork] = useState<APIChainsResponse| null>(null);
  const [selectedToken, setSelectedToken] = useState<APITokensResponse| null>(null);
  const [rates, setRates] = useState<{usd:number, amount:number}| null>(null);
  const { data:chainData, error:chainError, isFetching:chainIsFetching, isLoading:chainLoading } = useGetMayanChains();
  const { data:tokenData, error:tokenError, isFetching: tokenIsFetching, isLoading: tokenLoading, refetch: fetchTokens } = useGetMayanCoins(selectedNetwork?.nameId);
  const { calculateRate } = useMayanCalculateSwap({ amount });
  const destinationToken = "usdc";
  const destinationNetwork = "avalanche";

  console.log("mayan-swap-modal-config", { isOpen, isLoading, amount, coin, mayanConfig, rpcs, sourceChains, destinationChains, tokensFrom, tokensTo });

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
    const selectedN = (tokenData || []).find(n=>n.coingeckoId == v.value);
    if (!selectedN) return;
    setSelectedToken(selectedN);
    console.log("get-quote");
    return calculateRate();
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
    return ({
      loading: tokenIsFetching || tokenLoading,
      data: tokenData,
      error: tokenError?.message,
      optionMapped: (tokenData || []).map(r=>({ label: r.name, value: r.coingeckoId, meta:{ icon: r.logoURI, symbol: r.symbol } })),
      selectedOption: selectedToken ? { label:selectedToken.name, value: selectedToken.coingeckoId, meta:{ 
        icon: selectedToken.logoURI, 
        symbol: selectedToken.symbol,
        usdRate:rates ? String(rates.usd) : undefined, 
        amount:rates ? String(rates.amount) : undefined
      }} : null,
      selectOption: SetToken
    })
  },[tokenData, tokenIsFetching, tokenLoading, selectedToken, SetToken ]);

  const swapPayload: SwapDataResponse | undefined = useMemo(()=>{
    if (!selectedNetwork)return undefined;
    if (!selectedToken) return undefined;

    // return undefined;
    return ({
      ready: false,
      loading: true,
      data: {
        rate: 1000,
        amount: amount,
        tokenFrom: selectedToken.name,
        tokenTo: destinationToken,
        chainFrom: selectedNetwork.chainName,
        chainTo: destinationNetwork,
        amountFrom: amount * 10,
        amountTo: amount,
        usdAmount: amount,
      }
    });
  },[calculateRate]);

  return {
    mayanConfig,
    loading: false,
    networksPayload,
    tokensPayload,
    swapPayload,
    btnLoading: false,
    btnReady: false,
  }
}

export default useMayanSwapAction;
