
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useMemo, type FC } from "react";
import { Loader2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConnectorProps, WalletConnectListType } from "../types";

import MetaMaskLogo from "../../../assets/icons/metamask.svg";
import CoreWalletLogo from "../../../assets/icons/core-wallet.svg";
import WalletConnectLogo from "../../../assets/icons/wallet-connect.svg";
import CoinBaseWalletLogo from "../../../assets/icons/coinbase-wallet.svg";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

const WALLET_LOGO: Record<string, string> = {
  MetaMask: MetaMaskLogo,
  "Core Wallet": CoreWalletLogo,
  "Core": CoreWalletLogo,
  WalletConnect: WalletConnectLogo,
  "Coinbase Wallet": CoinBaseWalletLogo,
};

const ConnectorList: FC<WalletConnectListType> = ({
    connectors,
    isLoading,
    setSelectedConnector,
    selectedConnector,
    connected,
}) => {
    return (
      <div className="pam-flex pam-flex-col pam-gap-6">
        {(connectors || []).map((connector: ConnectorProps) => {
            const isActive = selectedConnector?.id === connector.id;
            // console.log(isActive, selectedConnector, connector);
            const logo = connector.icon
            return (
                <button
                    key={connector.name}
                    type="button"
                    disabled={connected}
                    onClick={() => {
                        setSelectedConnector(connector);
                    }}
                    className={`pam-flex pam-items-center pam-justify-between pam-rounded-2xl pam-border pam-border-[#DFDFE6] pam-p-1 pam-px-4 pam-py-3 pam-text-left hover:pam-border-blue-darkest hover:!pam-border-opacity-30 disabled:pam-cursor-not-allowed disabled:pam-opacity-50 ${
                        isActive
                            ? "pam-border-blue-darkest !pam-border-opacity-60 pam-bg-blue-lightest pam-bg-opacity-50 pam-text-blue-darkest"
                            : "pam-border-[#DFDFE6]"
                    }`}
                >
                    <span className="pam-flex pam-w-full pam-items-center pam-gap-2">
                        <span>{connector.name}</span>
                        {isLoading &&
                            selectedConnector?.id === connector?.id && (
                                <span className="pam-animate-spin">
                                    <Loader2 size={16} />
                                </span>
                            )}
                    </span>

                    <span>
                        {logo != null && (
                            <img src={logo} width={20} height={20} alt="" />
                        )}
                    </span>
                </button>
            );
        })}
      </div>
    );
};

const SolanaConnectorList = ({chainId}:{chainId:number}) => {
  const { connected, connecting, wallets, wallet, select } = useWallet();

  // select-wallet
  const selectWallet = async (connect: ConnectorProps) => {
    if (!connect){
      throw Error("Select a Wallet to continue")
    }
    const selectedW = wallets.find(w=>w.adapter.name == connect.id);
    if (!selectedW){
      throw Error("select wallet to connect!");
    }
    await select(selectedW?.adapter.name);
  }
  const connectors = useMemo(()=>wallets.map((wallet)=>({ id: wallet?.adapter.name, name: wallet?.adapter.name, icon: wallet?.adapter.icon, ready: true })),[wallets])
  const selectedWallet = useMemo(()=>(wallet ? { id: wallet?.adapter.name, name: wallet?.adapter.name, icon: wallet?.adapter.icon, ready: true } : null),[wallet]);

  return <ConnectorList     
    connectors={connectors}
    isLoading={connecting}
    setSelectedConnector={selectWallet}
    selectedConnector={selectedWallet}
    connected={connected}
  />
}

const EvmConnectorList  = ({ chainId }: { chainId: number }) => {
  const { connector, isConnected } = useAccount();
  const { connectors:wallets, isPending: isConnecting, } = useConnect();
  const { switchChainAsync } =useSwitchChain()
  console.log(wallets, connector, isConnected);
  // select-wallet
  const selectWallet = async (connect: ConnectorProps) => {
    if (!connect){
      throw Error("Select a Wallet to continue")
    }
    const selectedW = wallets.find(w=>w.id == connect.id);
    if (!selectedW){
      throw Error("select wallet to connect!");
    }
    await selectedW.connect();
    await switchChainAsync({ chainId });
  }
  const connectors = useMemo(()=>wallets.map((wallet)=>({ id: wallet?.id, name: wallet?.name, icon: WALLET_LOGO[wallet.name], ready: true })),[wallets]);
  const selectedWallet = useMemo(()=>(connector ? { id: connector?.id, name: connector?.name, icon: WALLET_LOGO[connector.name], ready: true } : null),[connector]);

  return <ConnectorList     
    connectors={connectors}
    isLoading={isConnecting}
    setSelectedConnector={selectWallet}
    selectedConnector={selectedWallet}
    connected={isConnected}
  />
}

const WalletConnectorList = ({ chainType, chainId }: { chainType: string, chainId:number }) => {
  console.log(chainType, chainId);
  if (chainType === "SOLANA"){
    return <SolanaConnectorList chainId={chainId} />
  } else {
    return <EvmConnectorList chainId={chainId} />
  }
}

export default React.memo(WalletConnectorList);
