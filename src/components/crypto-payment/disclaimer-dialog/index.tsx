"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import { X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Modal from "../../../components/common/modal";


const DisclaimerDialog = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
	return (
		<Modal
			isOpen={isOpen}
			closeModal={() => {
				closeModal();
			}}
		// disableClickOutside
		>
			<div className="pam:mx-auto pam:flex pam:w-full pam:flex-col pam:gap-4 vsm:max-w-[400px]">
				<div className="pam:mx-auto pam:flex pam:w-full pam:flex-col pam:gap-6 pam:bg-form-background pam:p-6 pam:sm:pam:rounded-2xl pam:sm:pam:border pam:sm:pam:border-border-color pam:backdrop-blur-md">
					<div className="pam:flex pam:w-full pam:items-center pam:justify-between">
						<h2 className="pam:text-2xl pam:font-bold pam:text-heading-text">Disclaimer</h2>

						<button
							className="pam:rounded-full pam:border pam:border-border-color pam:p-2 pam:text-heading-text pam:duration-200 pam:hover:pam:border-error-text pam:hover:pam:text-error-text"
							onClick={() => {
								closeModal();
							}}
							type="button"
							aria-label="Close"
						>
							<X size={16} strokeWidth={2} />
						</button>
					</div>
					<ul className="pam:pl-4 pam:text-left pam:text-sm pam:text-body-text">
						<li className="pam:list-disc">
							I understand that this transaction, like all blockchain transactions, is irreversible.
							Neither the Chainsite upon which this transaction occurs nor Pakt can manually access or
							influence this transaction.
						</li>
						<br />
						<li className="pam:list-disc">
							Funds will be deposited in a single-use non-custodial escrow wallet protected by
							banking-grade Multi-Party Compute key sharding.
						</li>
						<br />{" "}
						<li className="pam:list-disc">
							The keys will be reassembled and funds will be released in only three pre-programmed
							circumstances:
							<br /> a) a job is completed <br />
							b) a job is cancelled <br /> c) an Issue Resolution occurs. <br />
						</li>
						<br />
						<li className="pam:list-disc">
							Neither this Chainsite nor Pakt is responsible for any user error or issue that arises from
							complications due to your wallet provider.
						</li>
					</ul>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(DisclaimerDialog);
