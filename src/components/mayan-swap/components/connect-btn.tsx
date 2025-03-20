
import { memo, useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Quote, swapFromSolana, swapFromEvm, } from "@mayanfinance/swap-sdk";
import { useBalance, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

import { safeAsync } from "../../../lib/error-handler";
import { Button, Spinner } from "components/common";

const EVMConnectBtn = ({ quote, chainId, destinationAddress }: { quote:Quote, destinationAddress: string, chainId:number }) => {
  const {
      address,
      isConnected,
      connector: activeConnector,
  } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { connectors, isPending:isConnecting } = useConnect();
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapError, setSwapError] = useState<unknown | null>(null);
  const { data: walletClient } = useWalletClient();
  const { data, isLoading, refetch } = useBalance({ address });

  const getEthersSigner = async () => {
    if (!activeConnector || !walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient?.transport);
    return await provider.getSigner();
  };
    
  const fetchBalance = async() => {
    if (!activeConnector || !address || !data) {
      throw new Error("Wallet not connected!");
    }
    const activeChain = await activeConnector.getChainId();
    console.log("connected--Id", chainId, activeChain);
    if (chainId != activeChain) {
      const switRes = await switchChainAsync({ chainId });
      console.log("chain-switched", switRes);
    }
    const balanceReq = await refetch({cancelRefetch: true, throwOnError: true });
    if (!balanceReq || !balanceReq.data) return setSwapError("Balance Fetch Issue");
    console.log("balance---", balanceReq, quote.effectiveAmountIn);
    if (parseFloat(balanceReq.data?.formatted) < quote.effectiveAmountIn){
      setSwapError("Insufficient Funds to proceed!");
      return;
    }
  }
  
  useEffect(()=>{
    fetchBalance();
  },[activeConnector, address, data, chainId])

  // Process Swap
  const ProcessSwap = async () => safeAsync(async()=> {
    try{
      setSwapError(null);
      setIsSwapping(true);
      // if (!activeConnector || !address || !data) {
      //   throw new Error("Wallet not connected!");
      // }
      // const activeChain = await activeConnector.getChainId();
      // console.log("connected--Id", chainId, activeChain);
      await fetchBalance();
      // const EthSigner = await activeConnector.getProvider();
      const signer = await getEthersSigner();
      if (!signer) {
          throw Error("No signer available");
      }
      console.log(signer.getAddress(), signer.provider);
      // console.log(publicKey?.toString(), destinationAddress);
      // throw new Error("Try Again!");
      // const txToSign = await createSwapFromSolanaInstructions(quote, String(publicKey?.toString()), destinationAddress, undefined)
      // proceed to generate tx to Sign
      const txToSign =  await swapFromEvm(quote, String(address), destinationAddress, null, signer, null, null, null);
      console.log("tx-sign-->", txToSign);
      activeConnector?.disconnect();
    }catch(err){
      setIsSwapping(false);
      activeConnector?.disconnect();
      throw err;
    }
  })

  const selectWallet = useCallback(async ()=> {
    return safeAsync(async ()=>{
      if (!activeConnector){
        throw Error("select wallet to connect!");
      }
      const selectedW = connectors.find(w=>w.id == activeConnector.id);
      if (!selectedW){
        throw Error("select wallet to connect!");
      }
      await selectedW.connect()
    })
  },[]);

  return (
    <div className="pam-mt-auto pam-w-full">
      <Button
          disabled={isConnecting || isSwapping || isConnecting || isLoading || !!swapError}
          onClick={isConnected ? ProcessSwap: selectWallet}
          fullWidth
          variant="primary"
          size="md"
      >
          <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
              {(isSwapping) ? 
                <Spinner />: <span>{swapError ? `${String(swapError)}` :isConnected ? "Swap": "Connect Wallet"}</span>
              }
          </div>
      </Button>
    </div>
  )
};

const SolanaConnectBtn = ({ quote, destinationAddress, chainId }: { quote:Quote, destinationAddress: string, chainId:number }) => {
  const { connecting, connected, connect, disconnect, wallet, wallets, select, signTransaction, publicKey } = useWallet();
  const { connection } = useConnection();
  const [swapError, setSwapError] = useState<unknown | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // function-to-wait-for-connection
  const waitForConnection = async () => {
      setIsConnecting(true);
      if (!connected) {
          try {
              await connect(); // This will trigger the wallet connection flow
          } catch (error) {
              console.error("Connection failed:", error);
              setIsConnecting(false);
              return;
          }
      }

      // Wait until the `connected` state is true
      while (!connected) {
          await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Wallet successfully connected!", connected);
      setIsConnecting(false);
  };

  useEffect(()=>{
    const fetchBalance = async() => {
      if (publicKey){
        const balanceLamports = await connection.getBalance(publicKey);
        const walletBalance = balanceLamports / LAMPORTS_PER_SOL;
        if (walletBalance < quote.effectiveAmountIn){
          setSwapError("Insufficient Funds to proceed!");
        }
      }
    }
    fetchBalance();
  },[connection, publicKey])

  // process-swap
  const ProcessSwap = async () => safeAsync(async()=> {
    try{
      setIsSwapping(true);
      await waitForConnection();
      console.log("public-key", publicKey?.toString(), wallet?.adapter.publicKey?.toBase58())
      if (!publicKey || !signTransaction){
        throw new Error("Wallet not connected!");
      }
      const balanceLamports = await connection.getBalance(publicKey);
      const walletBalance = balanceLamports / LAMPORTS_PER_SOL;
      console.log(quote.effectiveAmountIn, walletBalance);
      if (walletBalance < quote.effectiveAmountIn){
        setSwapError("Insufficient Funds to proceed!");
        throw new Error("Insufficient Funds to proceed!");
      }
      // console.log(publicKey?.toString(), destinationAddress);
      // throw new Error("Try Again!");
      // const txToSign = await createSwapFromSolanaInstructions(quote, String(publicKey?.toString()), destinationAddress, undefined)
      // proceed to generate tx to Sign
      const txToSign =  await swapFromSolana(quote, String(publicKey?.toString()), destinationAddress, null, signTransaction, connection);
      console.log("tx-sign-->", txToSign);
      disconnect();
    }catch(err){
      setIsSwapping(false);
      disconnect();
      throw err;
    }
  })

  // select-wallet
  const selectWallet = async () => {
    if (!wallet){
      throw Error("Select a Wallet to continue")
    }
    const selectedW = wallets.find(w=>w.adapter.name == wallet.adapter.name);
    if (!selectedW){
      throw Error("select wallet to connect!");
    }
    await select(selectedW?.adapter.name);
    return waitForConnection();
  }

  return (
    <div className="pam-mt-auto pam-w-full">
      <Button
          disabled={connecting || isSwapping || isConnecting || !!swapError}
          onClick={connected ? ProcessSwap: selectWallet}
          fullWidth
          variant="primary"
          size="md"
      >
          <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
              {(isSwapping) ? 
                <Spinner />: <span>{swapError ? `${String(swapError)}` :connected ? "Swap": "Connect Wallet"}</span>
              }
          </div>
      </Button>
    </div>
  )
};

const RenderConnectBtn = ({ chainType, quote, destinationAddress, chainId }: { chainType:string, quote:Quote, destinationAddress: string, chainId:number }) => {
  if (chainType == "SOLANA"){
    return <SolanaConnectBtn 
      quote={quote}
      destinationAddress={destinationAddress}
      chainId={chainId}
    />;
  } else if (chainType == "EVM"){
    return <EVMConnectBtn 
      quote={quote}
      destinationAddress={destinationAddress}
      chainId={chainId}
    />;
  } else {
    throw new Error("invalid Chain selected");
  }
};

export default memo(RenderConnectBtn);
