/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { APIError, APIResponse, getAxiosInstance } from "lib/axios-instance";
import { triggerGlobalError } from "lib/error-handler";
import { APIChainsResponse, APITokensResponse } from "../types";

const axiosInstance = axios.create({
  baseURL: "https://price-api.mayan.finance/v3"
});

const getChainList = async (): Promise<APIChainsResponse[]> => {
  const response = await axiosInstance.get(`/chains`);
  return response.data;
};

const getCoinList = async (chain?:string): Promise<APITokensResponse[]> => {
  if (!chain) return [];
  const response = await axiosInstance.get(`/tokens?chain=${chain}&nonPortal=true`);
  return response.data[chain] || [];
};

const getTokenPrice = async (token:string):Promise<number> => {
  if (!token) return 1;
  const response = await axiosInstance.get(`/price?id=${token}`);
  return response.data.price;
}

// Payment Hooks
const useGetMayanChains = (): UseQueryResult<APIChainsResponse[], APIError> => useQuery({
  queryFn: () => getChainList(),
  queryKey: ["get-mayan-chain"],
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 60000,
  refetchIntervalInBackground: true,
});

const useGetMayanCoins = (chain?:string): UseQueryResult<APITokensResponse[], APIError> => useQuery({
  queryFn: () => getCoinList(chain),
  queryKey: [`get-mayan-${chain}-coin`],
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 60000,
  refetchIntervalInBackground: true,
});

const useGetTokenPrice = (token:string): UseQueryResult<number, APIError> => useQuery({
  queryFn: () => getTokenPrice(token),
  queryKey: [`get-mayan-${token}-price`],
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 60000,
  refetchIntervalInBackground: true,
});


export {
  useGetMayanChains,
  useGetMayanCoins,
  useGetTokenPrice
}
