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
                        className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-red-100 ring-1 ring-red-800 ring-opacity-50`}
                    >
                        <div className="w-0 flex-1 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CircleAlert className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                    <p className="text-sm leading-5 text-red-700">
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
                    className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-green-100 ring-1 ring-green-800 ring-opacity-50`}
                >
                    <div className="w-0 flex-1 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                <p className="text-sm leading-5 text-green-700">
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
    // 				<div className="flex-1 p-1">
    // 					<div className="flex flex-row items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="ml-3 flex flex-col">
    // 							<h2 className="text-sm font-bold leading-5 text-green-700">{title}</h2>
    // 							<p className="text-sm leading-5 text-green-700">{message}</p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		) : (
    // 			<div
    // 				className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-green-100 ring-1
    // 					ring-green-800 ring-opacity-50`}
    // 			>
    // 				<div className="flex-1 p-1">
    // 					<div className="flex flex-row items-center">
    // 						{/* <TalentProfile src={image} size="sm" score={score ?? 0} url={`/talents/${userId}`} /> */}
    // 						<div className="ml-3 flex flex-col">
    // 							<h2 className="text-sm font-bold leading-5 text-green-700">{title}</h2>
    // 							<p className="text-sm leading-5 text-green-700">{message}</p>
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
                    className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg bg-blue-100 ring-1 ring-blue-800 ring-opacity-50`}
                >
                    <div className="w-0 flex-1 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CircleAlert className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3 flex md:flex md:justify-between">
                                <p className="text-sm leading-5 text-blue-700">
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
