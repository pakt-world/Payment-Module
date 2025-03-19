import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

const useSolana = () => {
  const solana = useWallet();
  console.log("solana-wallets", solana.wallets, solana.wallet);

  // Function to select Phantom wallet
  const selectWallet = (id:string) => useCallback(() => {
    solana.select(id as any);
  }, [solana.select]);

  return {
    connect: selectWallet,
    isConnecting: solana.connecting,
    connected: solana.connected,
    wallets: solana.wallets,
    selectedWallet: solana.wallet,
  }
}

export default useSolana;
