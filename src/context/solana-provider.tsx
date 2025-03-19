import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from '@solana/web3.js';
import { FC, useMemo } from 'react';

type Props = {
  readonly children: React.ReactNode;
};

export const SolanaWalletProvider: FC<Props> = ({ children }) => {

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = [
    new UnsafeBurnerWalletAdapter(),
  ];
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
