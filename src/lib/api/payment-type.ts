
interface APIResponse<T> {
  error: boolean;
  message: string;
  data: T
}

interface StripePaymentParams {
  collectionId: string;
}

interface ConfirmPaymentParams {
	collectionId: string;
	delay?: number;
}

interface ConfirmPaymentResponse {
  _id: string;
}

interface StripePaymentResponse {
  client_secret: string;
  kyc_details_provided: boolean;
}

export {
  type APIResponse,
  type ConfirmPaymentParams,
  type ConfirmPaymentResponse,
  type StripePaymentParams,
  type StripePaymentResponse,
}
