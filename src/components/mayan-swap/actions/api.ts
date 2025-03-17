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

// const postConfirmPayment = async (
// params: ConfirmPaymentParams
// ): Promise<ConfirmPaymentResponse> => {
// const axios = getAxiosInstance();
// await new Promise((resolve): void => {
//   setTimeout(resolve, params.delay ?? 0);
// });
// const response = await axios.post(`/payment/confirm`, { 
//   collection: params.collectionId 
// });
// return response.data?.data;
// };

// Payment Hooks

export const useGetMayanChains = (): UseQueryResult<APIChainsResponse[], APIError> => useQuery({
  queryFn: () => getChainList(),
  queryKey: ["get-mayan-chain"],
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 60000,
  refetchIntervalInBackground: true,
});

export const useGetMayanCoins = (chain?:string): UseQueryResult<APITokensResponse[], APIError> => useQuery({
  queryFn: () => getCoinList(chain),
  queryKey: [`get-mayan-${chain}-coin`],
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 60000,
  refetchIntervalInBackground: true,
});

// const usePostStripeInitiate = () => {
// const appDataOptions: UseMutationOptions<
//   StripePaymentResponse,
//   APIError,
//   StripePaymentParams
// > = {
//     mutationFn: postStripeInitiatePayment,
//     onError: (err) => {
//         triggerGlobalError(err.response?.data?.message as string);
//     },
// };
// return useMutation(appDataOptions);
// };
