/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import toastPrimitive from "react-hot-toast";
import { CheckCircle, CircleAlert } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import { TalentProfile } from "./talent-profile-image";

export const toast = {
    error: (message: string) =>
        toastPrimitive.custom(
            (t) => {
                return (
                    <div
                        className={`${t.visible ? "pam:animate-enter" : "pam:animate-leave"} pam:pointer-events-auto pam:flex pam:w-full pam:max-w-md pam:rounded-lg pam:bg-error-background pam:ring-1 pam:ring-error-text pam:ring-opacity-50`}
                    >
                        <div className="pam:w-0 pam:flex-1 pam:p-4">
                            <div className="pam:flex pam:items-center">
                                <div className="pam:flex-shrink-0">
                                    <CircleAlert className="pam:h-6 pam:w-6 pam:text-error-text" />
                                </div>
                                <div className="pam:ml-3 pam:flex-1 pam:md:pam:flex pam:md:pam:justify-between">
                                    <p className="pam:text-sm pam:leading-5 pam:text-error-text">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
            {
                duration: 5000,
            }
        ),
    success: (message: string) =>
        toastPrimitive.custom(
            (t) => (
                <div
                    className={`${t.visible ? "pam:animate-enter" : "pam:animate-leave"} pam:pointer-events-auto pam:flex pam:w-full pam:max-w-md pam:rounded-lg pam:bg-success-background pam:ring-1 pam:ring-success-text pam:ring-opacity-50`}
                >
                    <div className="pam:w-0 pam:flex-1 pam:p-4">
                        <div className="pam:flex pam:items-center">
                            <div className="pam:flex-shrink-0">
                                <CheckCircle className="pam:h-6 pam:w-6 pam:text-success-text" />
                            </div>
                            <div className="pam:ml-3 pam:flex-1 pam:md:flex pam:md:justify-between">
                                <p className="pam:text-sm pam:leading-5 pam:text-success-text">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: 5000,
            }
        ),
    // message: (title: string, message: string, userId: string, image?: string, score?: number, messageId?: string) => {
    // 	toastPrimitive.custom((t) => {
    // 		const router = useRouter();
    // 		return messageId ? (
    // 			<div
    // 				className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md cursor-pointer rounded-lg
    // 					bg-green-100 ring-1 ring-green-800 ring-opacity-50`}
    // 				onClick={() => {
    // 					router.push(`/messages/${messageId}`);
    // 				}}
    // 				role="button"
    // 				tabIndex={0}
    // 				onKeyDown={(e) => {
    // 					e.preventDefault();
    // 				}}
    // 			>
    // 				<div className="pam:flex-1 pam:p-1">
    // 					<div className="pam:flex pam:flex-row pam:items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="pam:ml-3 pam:flex pam:flex-col">
    // 							<h2 className="pam:text-sm pam:font-bold pam:leading-5 pam:text-green-700">{title}</h2>
    // 							<p className="pam:text-sm pam:leading-5 pam:text-green-700">{message}</p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		) : (
    // 			<div
    // 				className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-green-100 ring-1
    // 					ring-green-800 ring-opacity-50`}
    // 			>
    // 				<div className="pam:flex-1 pam:p-1">
    // 					<div className="pam:flex pam:flex-row pam:items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="pam:ml-3 pam:flex pam:flex-col">
    // 							<h2 className="pam:text-sm pam:font-bold pam:leading-5 pam:text-green-700">{title}</h2>
    // 							<p className="pam:text-sm pam:leading-5 pam:text-green-700">{message}</p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		);
    // 	});
    // },
    info: (message: string) =>
        toastPrimitive.custom(
            (t) => (
                <div
                    className={`${t.visible ? "pam:animate-enter" : "pam:animate-leave"} pam:pointer-events-auto pam:flex pam:w-full pam:max-w-md pam:rounded-lg pam:bg-brand-accent/10 pam:ring-1 pam:ring-brand-accent pam:ring-opacity-50`}
                >
                    <div className="pam:w-0 pam:flex-1 pam:p-4">
                        <div className="pam:flex pam:items-center">
                            <div className="pam:flex-shrink-0">
                                <CircleAlert className="pam:h-6 pam:w-6 pam:text-brand-accent" />
                            </div>
                            <div className="pam:ml-3 pam:flex pam:md:flex pam:md:justify-between">
                                <p className="pam:text-sm pam:leading-5 pam:text-brand-accent">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: 5000,
            }
        ),
};
