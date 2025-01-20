
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Copy, CopyCheck } from "lucide-react";
import QRCode from "react-qr-code";
import { useCopyToClipboard } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button, Spinner} from "../../components/common";

interface DepositToAddressProps {
	amount: number;
	coin: string;
	depositAddress: string;
	closeModel: () => void;
}

export const DepositToAddress = ({
	amount,
	depositAddress,
	closeModel,
	coin,
}: DepositToAddressProps): React.JSX.Element => {
	const [value, copy] = useCopyToClipboard();
  const isLoading = false;

	return (
		<div className="flex w-full flex-col gap-4 max-sm:!h-full max-sm:pb-[68px]">
			<p className="text-center text-sm text-body">
				Copy the wallet address or scan QR code to make payment. Click I have made transfer to continue.
			</p>
			<p className="text-center text-sm font-medium text-[#DC3545]">
				ALERT: Make sure to add your sending wallet fee.
			</p>

			<div
				className="flex items-center justify-between gap-2 rounded-2xl border border-primary bg-secondary px-4 py-6 text-primary
					max-sm:h-[43px]"
			>
				<span className="text-lg">Total Amount:</span>
				<span className="text-lg font-bold">
					{amount} {coin}
				</span>
			</div>

			<div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4">
				<span className="line-clamp-1 break-words text-sm text-body">{depositAddress}</span>

				<button
					className="flex shrink-0 items-center gap-1 rounded-lg border border-blue-darkest !border-opacity-80 bg-blue-lightest px-3 py-2
						text-xs text-blue-darkest !text-opacity-80"
					onClick={async () => copy(depositAddress)}
					type="button"
				>
					{value !== null ? <CopyCheck size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
					<span>
						{value !== null ? (
							<span className="animate-pulse">Copied</span>
						) : (
							<span className="animate-pulse">Copy</span>
						)}
					</span>
				</button>
			</div>

			<div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4 shadow">
				<QRCode value={depositAddress} size={150} />
			</div>

			<Button
				onClick={() => {
					// confirmPayment.mutate(
					// 	{ jobId },
					// 	{
					// 		onSuccess: () => {
					// 			if (talentId !== "") {
					// 				inviteTalent.mutate(
					// 					{
					// 						jobId,
					// 						talentId,
					// 					},
					// 					{
					// 						onSuccess: () => {
					// 							router.push(`/dashboard`);
					// 						},
					// 					}
					// 				);
					// 			}
					// 			closeModel();
					// 			router.push(`/dashboard`);
					// 		},
					// 		onError: () => {},
					// 	}
					// );
				}}
				fullWidth
				variant="primary"
				size="md"
			>
				{isLoading ? <Spinner /> : "I have made transfer"}
			</Button>
		</div>
	);
};
