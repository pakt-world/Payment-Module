import { Quote } from "@mayanfinance/swap-sdk";
import { BasicModalProps, IAny, onFinishResponseProps } from "types";

interface MayanSwapModalProps extends BasicModalProps {
  amount: number;
  // coin: string;
  // chain: string;
  onSuccessResponse:(data: onFinishResponseProps) => void;
  isLoading?:boolean;
}

type MayanWidgetChainName =
  | "solana"
  | "ethereum"
  | "bsc"
  | "polygon"
  | "avalanche"
  | "arbitrum"
  | "optimism"
  | "base";

interface MayanWidgetProps {
  sourceChains: MayanWidgetChainName[];
  destinationChains: MayanWidgetChainName[];
  rpcs: Record<string, string>;
  tokensFrom?: { [index in MayanWidgetChainName]?: string[] };
  tokensTo?: { [index in MayanWidgetChainName]?: string[] };
}

interface SetReadyProps {
  setReady: () => void;
}

interface MayanConfigProps {
  appName: string;
  appIcon: string;
  appUrl: string;
  colors?: {
    background: string
  }
}

interface APIChainsResponse {
  baseToken:string;
  blockExplorer: string;
  chainId: string;
  chainName: string;
  currencySymbol: string;
  destinationActive: boolean;
  fullChainName: string;
  logoURI: string;
  mayanContractAddress: string
  mode: string;
  nameId: string;
  originActive: boolean;
  rpcURL: string
  tokenBridgeAddress: string
  wChainId: number;
  wrapContractAddress: string
}

interface APITokensResponse {
  chainId: number;
  coingeckoId: string;
  contract: string;
  decimals: number
  hasAuction: boolean;
  logoURI: string;
  mint: string;
  name: string;
  pythUsdPriceId: string;
  realOriginChainId: number;
  realOriginContractAddress: string;
  standard:string;
  supportsPermit: boolean;
  symbol: string;
  verified: boolean;
  wChainId: number;
  wrappedAddress: string;
};

interface Option {
  label:string;
  value:string;
  meta?:{
    icon?:string;
    usdRate?: string;
    amount?: string;
  } & Record<string, IAny>;
}

interface OptionDataResponse<T> {
  loading: boolean;
  data?: Array<T | {}>;
  error?: string;
  optionMapped?: Option[]
  selectedOption?: Option | null;
  selectOption: (v:Option) => void;
}

interface SwapDataResponse {
  ready: boolean;
  loading: boolean;
  currentQuote: Quote | null;
  allQuotes: Quote[] | null;
  coinOutPriceUsd: number;
}

export {
  MayanSwapModalProps,
  MayanWidgetProps,
  MayanWidgetChainName,
  SetReadyProps,
  type MayanConfigProps,
  type APIChainsResponse,
  type OptionDataResponse,
  type Option,
  type APITokensResponse,
  type SwapDataResponse,
}
