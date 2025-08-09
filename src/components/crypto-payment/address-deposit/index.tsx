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
    onResponse,
    isLoading
}: DepositToAddressProps): React.JSX.Element => {
    const [value, copy] = useCopyToClipboard();
    
    return (
        <div className="pam:flex pam:w-full pam:flex-col pam:gap-4 pam:max-sm:!pam:h-full pam:max-sm:pam:pb-[68px]">
            <p className="pam:text-center pam:text-sm pam:text-body-text">
                Copy the wallet address or scan QR code to make payment. Click I
                have made transfer to continue.
            </p>
                                <p className="pam:text-center pam:text-sm pam:font-medium pam:text-error-text">
                ALERT: Make sure to add your sending wallet fee.
            </p>

            <div className="pam:flex pam:items-center pam:justify-between pam:gap-2 pam:rounded-2xl pam:border pam:border-brand-primary pam:bg-brand-secondary pam:px-4 pam:py-6 pam:text-brand-primary pam:max-sm:pam:h-[43px]">
                <span className="pam:text-lg">Total Amount:</span>
                <span className="pam:text-lg pam:font-bold">
                    {amount} {coin.toUpperCase()}
                </span>
            </div>

            <div className="pam:flex pam:w-full pam:items-center pam:justify-between pam:gap-2 pam:rounded-2xl pam:border pam:border-border-color pam:bg-form-background pam:px-4 pam:py-4">
                <span className="pam:line-clamp-1 pam:break-words pam:text-sm pam:text-body-text">
                    {depositAddress}
                </span>

                <button
                                            className="pam:flex pam:shrink-0 pam:items-center pam:gap-1 pam:rounded-lg pam:border pam:border-brand-primary !pam:border-opacity-80 pam:bg-transparent pam:px-3 pam:py-2 pam:text-xs pam:text-brand-primary !pam:text-opacity-80"
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
                            <span className="pam:animate-pulse">Copied</span>
                        ) : (
                            <span className="pam:animate-pulse">Copy</span>
                        )}
                    </span>
                </button>
            </div>

                            <div className="pam:flex pam:items-center pam:justify-center pam:gap-2 pam:rounded-2xl pam:border pam:border-border-color pam:bg-form-background pam:px-4 pam:py-4 pam:shadow pam:h-[170px]">
                <QRCode 
                  value={depositAddress}
                  size={150}
                />
            </div>

            <Button
                onClick={()=>onResponse({ status:"success", message: "Payment successful", txId: "deposit"})}
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
