
import { fetchQuote, swapFromEvm, swapFromSolana, Quote, ChainName, } from "@mayanfinance/swap-sdk";
import { useState } from "react";
import { sleep } from "utils";
import { useGetTokenPrice } from "./api";
import useSwapWallet from "./solana";

interface CalculateSwapProps{
  selectedNetworkType: string;
  amount: number;
}

const useMayanCalculateSwap = ({ amount, selectedNetworkType }:CalculateSwapProps)=> {
  // const [tokenPrice,setTokenPrice] = useState<number|null>(null);
  const [allQuotes, setQuotes] = useState<Quote[] | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const slippage = 3;
  const gasDrop = 0;
  const { data:coinOutPriceUsd, isFetching, isFetched } = useGetTokenPrice("usd-coin");
  const { connected, isConnecting, selectedWallet, wallets, setWallet } = useSwapWallet(selectedNetworkType);

  const fetchInitialSwapState = async(fromToken: string, toToken: string, fromChain: string, toChain: string):Promise<number> => {
    const initSwap = await fetchQuote({
      amount: 10,
      fromToken: fromToken,
      toToken: toToken,
      fromChain: fromChain as ChainName,
      toChain: toChain as ChainName,
      slippageBps: slippage * 100,
      gasDrop,
    });
    if (initSwap.length < 1){
      sleep(100);
      fetchInitialSwapState(fromToken, toToken, fromChain, toChain);
    }
    const tokenPrice = initSwap[0].price;
    const originalAmountInput = amount + ((slippage*2)/100 * amount);
    const expectedAmountCharge = originalAmountInput/tokenPrice;
    return expectedAmountCharge;
  }

  const fetchSwapData = async (fromToken: string, toToken: string, fromChain: string, toChain: string, amountIn:number):Promise<Quote[]> => {
    const initSwap = await fetchQuote({
      amount: parseFloat(amountIn.toFixed(6)),
      fromToken: fromToken,
      toToken: toToken,
      fromChain: fromChain as ChainName,
      toChain: toChain as ChainName,
      slippageBps: slippage * 100,
      gasDrop,
    });
    setQuotes(initSwap);
    if (initSwap.length >0){
      setCurrentQuote(initSwap[0]);
    }
    setQuoteLoading(false);
    return initSwap;
  };

  const calculateRate = async ({
    fromToken,
    toToken,
    fromChain,
    toChain,
  }:{
    fromToken: string;
    toToken: string
    fromChain: string;
    toChain: string;
  }) => {
    setQuoteLoading(true);
    console.log("calculate-Rate--==>", amount, fromToken, toToken, fromChain, toChain);
    const exchangeAmount = await fetchInitialSwapState(fromToken, toToken, fromChain, toChain);
    await fetchSwapData(fromToken, toToken, fromChain, toChain, exchangeAmount);
  }

  return {
    calculateRate,
    currentQuote,
    allQuotes,
    quoteLoading: quoteLoading || isFetching,
    quoteReady: (!!currentQuote && isFetched),
    coinOutPriceUsd,
    wallets,
    selectedWallet,
    isConnecting,
    connected,
    setWallet,
  }
}

export default useMayanCalculateSwap;
