/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
    useMutation,
    UseMutationOptions,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { APIError, APIResponse, getAxiosInstance } from "../axios-instance";
import { triggerGlobalError } from "../error-handler";
import { ConfirmPaymentParams, ConfirmPaymentResponse, StripePaymentParams, StripePaymentResponse } from "./payment-type";

const postStripeInitiatePayment = async (
  params: StripePaymentParams
): Promise<StripePaymentResponse> => {
  const axios = getAxiosInstance();
  const response = await axios.post(`/payment/stripe/initiate`, {
    collection: params.collectionId
  });
  return response.data?.data;
};

const postConfirmPayment = async (
  params: ConfirmPaymentParams
): Promise<ConfirmPaymentResponse> => {
  const axios = getAxiosInstance();
  await new Promise((resolve): void => {
    setTimeout(resolve, params.delay ?? 0);
  });
  const response = await axios.post(`/payment/confirm`, { 
    collection: params.collectionId 
  });
  return response.data?.data;
};

// Payment Hooks
const usePostConfirmPayment = () => {
    const appDataOptions: UseMutationOptions<
      ConfirmPaymentResponse,
      APIError,
      ConfirmPaymentParams
    > = {
        mutationFn: postConfirmPayment,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };
    return useMutation(appDataOptions);
};

const usePostStripeInitiate = () => {
  const appDataOptions: UseMutationOptions<
    StripePaymentResponse,
    APIError,
    StripePaymentParams
  > = {
      mutationFn: postStripeInitiatePayment,
      onError: (err) => {
          triggerGlobalError(err.response?.data?.message as string);
      },
  };
  return useMutation(appDataOptions);
};

export {
  usePostConfirmPayment,
  usePostStripeInitiate,
};
