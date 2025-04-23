/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "../../utils";

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 24, className }) => {
    return (
        <div className={cn(`pam-flex pam-w-full pam-items-center pam-justify-center`, className)}>
            <Loader className="pam-animate-spin" size={size} />
        </div>
    );
};
