/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { AddEthereumChainParameter, Chain, ProviderConnectInfo } from "viem";
import { Config } from "wagmi";
import { StrictOmit, ExactPartial } from "@wagmi/core/dist/types/types/utils";
import { type ConnectMutate } from "wagmi/query";

interface ConnectorProps {
    connect: () => Promise<{
        accounts: readonly `0x${string}`[];
        chainId: number;
    }>;
    disconnect: () => Promise<void>;
    emitter: any;
    getAccounts: () => Promise<readonly `0x${string}`[]>;
    getChainId: () => Promise<number>;
    getProvider: () => Promise<unknown>;
    id: string;
    isAuthorized: () => Promise<boolean>;
    name: string;
    onAccountsChanged: (accounts: string[]) => void;
    onChainChanged: (chainId: string) => void;
    onConnect?: ((connectInfo: ProviderConnectInfo) => void) | undefined;
    onDisconnect: () => void;
    setup?: (() => Promise<void>) | undefined;
    switchChain?:
        | ((parameters: {
              addEthereumChainParameter?:
                  | ExactPartial<
                        StrictOmit<AddEthereumChainParameter, "chainId">
                    >
                  | undefined;
              chainId: number;
          }) => Promise<Chain>)
        | undefined;
    type: string;
    ready?: boolean;
}

interface WalletConnectListType {
    activeConnector: ConnectorProps | undefined;
    selectedConnector: ConnectorProps | undefined;
    isLoading: boolean;
    connectors: ConnectorProps[];
    setSelectedConnector: (connector: ConnectorProps) => void;
    accountStatus: string;
}
interface BasicModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface CryptoPaymentModalProps extends BasicModalProps {
    amount: number;
    depositAddress: string;
    coin: string;
    chainId: number;
    contractAddress?: string;
    tokenDecimal: number;
}

interface CryptoPayWithWalletProps {
    amount: number;
    depositAddress: string;
    contractAddress?: string;
    tokenDecimal: number;
    chainId: number;
}

type I0xType = `0x${string}`;

interface ContractErrorType {
    name: string;
    message: string;
    shortMessage: string;
}

interface WalletDepositProps {
    chainId: number;
    isLoading: boolean;
    contractAddress: string;
    depositAddress: string;
    amountToPay: bigint;
    selectedConnector: ConnectorProps | undefined;
    activeConnector: unknown;
    isDisabled: boolean;
    showReconfirmButton: boolean;
    disableButtonOnClick: boolean;
    // setDisableButtonOnClick: (v: boolean) => void;
    // setShowReconfirmButton: (value_: boolean) => void;
    // closeModel: () => void;
    connect: ConnectMutate<Config, unknown>;
}

interface DepositToAddressProps {
  amount: number;
  coin: string;
  depositAddress: string;
}

export {
    type CryptoPaymentModalProps,
    type CryptoPayWithWalletProps,
    type ConnectorProps,
    type WalletConnectListType,
    type I0xType,
    type WalletDepositProps,
    type ContractErrorType,
    type BasicModalProps,
    type DepositToAddressProps,
};
