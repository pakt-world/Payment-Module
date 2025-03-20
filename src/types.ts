/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Quote } from "@mayanfinance/swap-sdk";
import { APIChainsResponse, APITokensResponse, ConnectorProps, OptionDataResponse, SwapDataResponse, VIEW_STEP } from "components/mayan-swap/types";

interface BasicModalProps {
  isOpen: boolean;
  closeModal: () => void;
  collectionId?: string;
}

interface onFinishResponseProps {
  status: string;
  txId: string;
}

type IAny = any;
type I0xAddressType = `0x${string}`;

interface ITheme extends Record<string, any> {
  primary?: string;
  info?: string;
  secondary?: string;
  "blue-lightest"?: string;
  "blue-darkest"?: string;
  line?: string;
  title?: string;
  body?: string;
  warning?: string;
  success?: string;
  danger?: string;
  magnolia?: string;
  "exhibit-tab-list"?: string;
  "primary-brighter"?: string;
  "refer-border"?: string;
  "btn-primary"?: string;
  "primary-gradient"?: string;
  "modal-radius"?: string;
}


interface IGetRequestSignature {
  signature: string;
  timeStamp: string;
}

interface IGetRequestSignatureParam {
  url: string;
  publicKey: string;
  clientId: string;
}

interface SwapStepOneProp {
  networksPayload: OptionDataResponse<APIChainsResponse>;
  tokensPayload: OptionDataResponse<APITokensResponse>;
  swapPayload?: SwapDataResponse;
  connecting:boolean;
  goToNext: () => void;
}

interface SwapStepTwoProp {
  selectedNetwork: { mode:string, chainId: number} | null | undefined;
  destinationAddress: string;
  quote: Quote | null | undefined;
}


export {
  IAny,
  I0xAddressType,
  type BasicModalProps,
  type onFinishResponseProps,
  type ITheme,
  type IGetRequestSignature,
  type IGetRequestSignatureParam,
  type SwapStepOneProp,
  type SwapStepTwoProp,
}
