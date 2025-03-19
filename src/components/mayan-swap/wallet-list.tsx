
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { type FC } from "react";
import { Loader2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ConnectorProps, WalletConnectListType } from "./types";


const SolanaConnectorList: FC<WalletConnectListType> = ({
    connectors,
    isLoading,
    setSelectedConnector,
    selectedConnector,
    accountStatus,
}) => {
    return (
      <div className="pam-flex pam-flex-col pam-gap-6">
        {(connectors || []).map((connector: ConnectorProps) => {
            const isActive = selectedConnector?.id === connector.id;
            const logo = connector.icon
            return (
                <button
                    key={connector.name}
                    type="button"
                    disabled={["connected", "connecting"].includes(accountStatus) && !isActive}
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

export default React.memo(SolanaConnectorList);
