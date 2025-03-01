/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { type FC } from "react";
import { Loader2 } from "lucide-react";
import { ConnectorProps, WalletConnectListType } from "../types";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import MetaMaskLogo from "../../../assets/icons/metamask.svg";
import CoreWalletLogo from "../../../assets/icons/core-wallet.svg";
import WalletConnectLogo from "../../../assets/icons/wallet-connect.svg";
import CoinBaseWalletLogo from "../../../assets/icons/coinbase-wallet.svg";
import Logger from "lib/logger";

const WALLET_LOGO: Record<string, string> = {
    MetaMask: MetaMaskLogo,
    "Core Wallet": CoreWalletLogo,
    "Core": CoreWalletLogo,
    WalletConnect: WalletConnectLogo,
    "Coinbase Wallet": CoinBaseWalletLogo,
};

const WalletConnectorList: FC<WalletConnectListType> = ({
    connectors,
    activeConnector,
    isLoading,
    setSelectedConnector,
    selectedConnector,
    accountStatus,
}) => {
    return (
        <div className="pam-flex pam-flex-col pam-gap-6">
            {connectors.map((connector: ConnectorProps) => {
                const isActive = selectedConnector?.id === connector.id || activeConnector?.id === connector.id;
                const logo = WALLET_LOGO[connector.name];
                return (
                    <button
                        key={connector.name}
                        type="button"
                        disabled={["connected", "connecting"].includes(accountStatus) && !isActive}
                        onClick={() => {
                            setSelectedConnector(connector);
                        }}
                        className={`pam-flex pam-items-center pam-justify-between pam-rounded-2xl pam-border pam-border-2 pam-p-1 pam-px-4 pam-py-3 pam-text-left hover:pam-border-blue-darkest hover:!pam-border-opacity-30 disabled:pam-cursor-not-allowed disabled:pam-opacity-50 ${
                            isActive
                                ? "pam-border-darkest !pam-border-opacity-60 pam-bg-lightest pam-bg-opacity-50 pam-text-darkest"
                                : "pam-border-primary"
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

export default React.memo(WalletConnectorList);
