import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

import { ConnectorProps } from "../types";

const useEvm = () => {
  const solana = useWallet();
  console.log("evm-wallets", solana.wallets, solana.wallet);

  // Function to select wallet
  const selectWallet = (wallet:ConnectorProps) => useCallback(() => {
    solana.select(wallet.id as any);
  }, [solana.select]);

  return {
    setWallet: selectWallet,
    isConnecting: solana.connecting,
    connected: solana.connected,
    wallets: solana.wallets.map(w=>({id:w.adapter.name, name:w.adapter.name, icon: w.adapter.icon, ready: true })),
    selectedWallet: solana.wallet ? {id:solana.wallet.adapter.name, name:solana.wallet.adapter.name, icon: solana.wallet.adapter.icon, ready: true }: undefined,
  }
}


const useSolana = () => {
  const solana = useWallet();
  console.log("solana-wallets", solana.wallets, solana.wallet);

  // Function to select wallet
  const selectWallet = (wallet:ConnectorProps) => useCallback(() => {
    console.log("selecting-->", wallet, solana.wallets, solana.wallet)
    // solana.select(wallet.id as any);
  }, [solana.select]);

  return {
    setWallet: selectWallet,
    isConnecting: solana.connecting,
    connected: solana.connected,
    wallets: solana.wallets.map(w=>({id:w.adapter.name, name:w.adapter.name, icon: w.adapter.icon, type: true })),
    selectedWallet: solana.wallet,
  }
}

const useSwapWallet = (chainType: string) => {
  const { connected, isConnecting, selectedWallet, wallets, setWallet } = chainType == "EVM" ? useEvm() : useSolana();
  return {
    connected, isConnecting, selectedWallet, wallets, setWallet
  }
}

export default useSwapWallet
