import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletConnectWalletAdapter, UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from '@solana/web3.js';
import { FC, useMemo } from 'react';

type Props = {
  config: {
    endpoint: string
  }
  readonly children: React.ReactNode;
};

export const SolanaWalletProvider: FC<Props> = ({ config, children }) => {
  const { endpoint } = config;
  
  const wallets = [
    new PhantomWalletAdapter(),
    new UnsafeBurnerWalletAdapter(),
    // new WalletConnectWalletAdapter({ }),
  ];
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
