/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Loader2 } from "lucide-react";
import { ConnectorProps, WalletConnectListType } from "types";

const WALLET_LOGO: Record<string, string> = {
    MetaMask: "/icons/metamask.svg",
    "Core Wallet": "/icons/core-wallet.svg",
    "Core": "/icons/core-wallet.svg",
    WalletConnect: "/icons/wallet-connect.svg",
    "Coinbase Wallet": "/icons/coinbase-wallet.svg",
};

export const WalletConnectorList: FC<WalletConnectListType> = ({
    connectors,
    activeConnector,
    isLoading,
    setSelectedConnector,
    selectedConnector,
    accountStatus,
}) => {
    return (
        <div className="flex flex-col gap-6">
            {connectors.map((connector: ConnectorProps) => {
                const isActive = activeConnector?.id === connector.id;
                const logo = WALLET_LOGO[connector.name];

                return (
                    <button
                        key={connector.name}
                        type="button"
                        disabled={accountStatus === "connected" && !isActive}
                        onClick={() => {
                            setSelectedConnector(connector);
                        }}
                        className={`flex items-center justify-between rounded-2xl border border-[#DFDFE6] p-1 px-4 py-3 text-left hover:border-blue-darkest hover:!border-opacity-30 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isActive
                                ? "border-blue-darkest !border-opacity-60 bg-blue-lightest bg-opacity-50 text-blue-darkest"
                                : "border-[#DFDFE6]"
                        }`}
                    >
                        <span className="flex w-full items-center gap-2">
                            <span>{connector.name}</span>
                            {isLoading &&
                                selectedConnector?.id === connector?.id && (
                                    <span className="animate-spin">
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
