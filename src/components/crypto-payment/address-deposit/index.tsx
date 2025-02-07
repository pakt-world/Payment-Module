/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Copy, CopyCheck } from "lucide-react";
import QRCode from "react-qr-code";
import { useCopyToClipboard } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button, Spinner } from "../../common";
import { DepositToAddressProps } from "../types";

const DepositToAddress = ({
    amount,
    depositAddress,
    coin,
    onSuccessResponse,
    isLoading
}: DepositToAddressProps): React.JSX.Element => {
    const [value, copy] = useCopyToClipboard();
  console.log("islopppo", isLoading);
    return (
        <div className="pam-flex pam-w-full pam-flex-col pam-gap-4 pam-max-sm:!pam-h-full pam-max-sm:pam-pb-[68px]">
            <p className="pam-text-center pam-text-sm pam-text-body">
                Copy the wallet address or scan QR code to make payment. Click I
                have made transfer to continue.
            </p>
            <p className="pam-text-center pam-text-sm pam-font-medium pam-text-[#DC3545]">
                ALERT: Make sure to add your sending wallet fee.
            </p>

            <div className="pam-flex pam-items-center pam-justify-between pam-gap-2 pam-rounded-2xl pam-border pam-border-primary pam-bg-secondary pam-px-4 pam-py-6 pam-text-primary pam-max-sm:pam-h-[43px]">
                <span className="pam-text-lg">Total Amount:</span>
                <span className="pam-text-lg pam-font-bold">
                    {amount} {coin.toUpperCase()}
                </span>
            </div>

            <div className="pam-flex pam-w-full pam-items-center pam-justify-between pam-gap-2 pam-rounded-2xl pam-border pam-border-line pam-bg-[#fcfcfc] pam-px-4 pam-py-4">
                <span className="pam-line-clamp-1 pam-break-words pam-text-sm pam-text-body">
                    {depositAddress}
                </span>

                <button
                    className="pam-flex pam-shrink-0 pam-items-center pam-gap-1 pam-rounded-lg pam-border pam-border-blue-darkest !pam-border-opacity-80 pam-bg-blue-lightest pam-px-3 pam-py-2 pam-text-xs pam-text-blue-darkest !pam-text-opacity-80"
                    onClick={async () => copy(depositAddress)}
                    type="button"
                >
                    {value !== null ? (
                        <CopyCheck size={14} strokeWidth={2} />
                    ) : (
                        <Copy size={14} strokeWidth={2} />
                    )}
                    <span>
                        {value !== null ? (
                            <span className="pam-animate-pulse">Copied</span>
                        ) : (
                            <span className="pam-animate-pulse">Copy</span>
                        )}
                    </span>
                </button>
            </div>

            <div className="pam-flex pam-items-center pam-justify-center pam-gap-2 pam-rounded-2xl pam-border pam-border-line pam-bg-[#fcfcfc] pam-px-4 pam-py-4 pam-shadow">
                <QRCode 
                  value={depositAddress}
                  size={150}
                />
            </div>

            <Button
                onClick={()=>onSuccessResponse({ status:"success", txId: "deposit"})}
                disabled={isLoading}
                fullWidth
                variant="primary"
                size="md"
            >
                {isLoading ? <Spinner /> : "I have made transfer"}
            </Button>
        </div>
    );
};

export default React.memo(DepositToAddress);
