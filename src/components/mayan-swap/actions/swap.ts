
import { fetchQuote, Quote, ChainName, } from "@mayanfinance/swap-sdk";
import { useMemo, useState } from "react";
import { sleep } from "utils";
import { getTokenPrice, useGetTokenPrice } from "./api";
import { onFinishResponseProps } from "types";

interface CalculateSwapProps{
  selectedNetworkType: string;
  amount: number;
  destinationAddress: string;
  onSuccessResponse: (data:onFinishResponseProps) => void;
}

const useMayanCalculateSwap = ({ amount, selectedNetworkType, destinationAddress, onSuccessResponse }:CalculateSwapProps)=> {
  const [quoteError, setQuoteError] = useState<any>(null);
  const [allQuotes, setQuotes] = useState<Quote[] | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const slippage = 3;
  const slipMulti = 6;
  const gasDrop = 0;
  const { data:coinOutPriceUsd, isFetching, isFetched } = useGetTokenPrice("usd-coin");

  const fetchInitialSwapState = async(fromToken: string, toToken: string, fromChain: string, toChain: string, fromPriceId: string):Promise<number> => {
    try {
      const defaultUSdAmt = 10;
      const initTokenPrice = await getTokenPrice(fromPriceId);
      const initSwapCheckAmount = (defaultUSdAmt / initTokenPrice).toFixed(6);
      // const initSwap = await fetchQuote({
      //   amount: parseFloat(initSwapCheckAmount),
      //   fromToken: fromToken,
      //   toToken: toToken,
      //   fromChain: fromChain as ChainName,
      //   toChain: toChain as ChainName,
      //   slippageBps: slippage * 100,
      //   gasDrop,
      // });
      // if (initSwap.length < 1){
      //   sleep(100);
      //   fetchInitialSwapState(fromToken, toToken, fromChain, toChain, fromPriceId);
      // }
      // const tokenPrice = initSwap[0].price;
      const tokenPrice = initTokenPrice;
      const originalAmountInput = amount + ((slippage*slipMulti)/100 * amount);
      const expectedAmountCharge = originalAmountInput/tokenPrice;
      console.log("rrr-", tokenPrice, expectedAmountCharge, originalAmountInput);
      return expectedAmountCharge;
    } catch (error) {
      console.log("eee--", error);
      setQuoteError(error);
      throw error
    } finally {
      setQuoteLoading(false);
    }
  }

  const fetchSwapData = async (fromToken: string, toToken: string, fromChain: string, toChain: string, amountIn:number):Promise<Quote[]> => {
    try {
      const initSwap = await fetchQuote({
        amount: parseFloat(amountIn.toFixed(6)),
        fromToken: fromToken,
        toToken: toToken,
        fromChain: fromChain as ChainName,
        toChain: toChain as ChainName,
        slippageBps: slippage * 100,
        gasDrop,
      });
      console.log("swap-response===>", initSwap);
      setQuotes(initSwap);
      if (initSwap.length >0){
        setCurrentQuote(initSwap[0]);
      }
      setQuoteLoading(false);
      return initSwap;
    } catch (error) {
      setQuoteError(error);
      throw error
    } finally{
      setQuoteLoading(false);
    }
  };

  const calculateRate = async ({
    fromToken,
    toToken,
    fromChain,
    toChain,
    fromPriceId
  }:{
    fromToken: string;
    toToken: string
    fromChain: string;
    toChain: string;
    fromPriceId: string
  }) => {
    setQuoteLoading(true);
    console.log("calculate-Rate--==>", amount, fromToken, toToken, fromChain, toChain);
    const exchangeAmount = await fetchInitialSwapState(fromToken, toToken, fromChain, toChain, fromPriceId);
    await fetchSwapData(fromToken, toToken, fromChain, toChain, exchangeAmount);
  }

  const resetQuote = () => {
    setCurrentQuote(null);
    setQuotes(null);
    setQuoteError(null);
  }

  return useMemo(()=>({
    calculateRate,
    currentQuote,
    allQuotes,
    quoteLoading: quoteLoading || isFetching,
    quoteReady: (!!currentQuote && isFetched),
    coinOutPriceUsd,
    quoteError,
    resetQuote,
  }),[
    calculateRate,
    currentQuote,
    allQuotes,
    quoteLoading, isFetching,
    currentQuote, isFetched,
    coinOutPriceUsd,
    quoteError,
    resetQuote
  ]);
}

export default useMayanCalculateSwap;
